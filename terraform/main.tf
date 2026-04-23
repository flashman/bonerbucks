# ──────────────────────────────────────────────────────────────
# Bonerbucks — Terraform Main
#
# Providers:
#   vercel/vercel  — Vercel project + env vars + domain
#   supabase/supabase — Supabase project + settings
#
# Usage:
#   cd terraform
#   cp terraform.tfvars.example terraform.tfvars   # fill in secrets
#   terraform init
#   terraform plan
#   terraform apply
# ──────────────────────────────────────────────────────────────

terraform {
  required_version = ">= 1.6"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }

  # ── REMOTE STATE (recommended for teams) ─────────────────
  # Uncomment and configure for production:
  #
  # backend "s3" {
  #   bucket = "my-tfstate-bucket"
  #   key    = "bonerbucks/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

# ──────────────────────────────────────────────────────────────
# Providers
# ──────────────────────────────────────────────────────────────

provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id != "" ? var.vercel_team_id : null
}

provider "supabase" {
  access_token = var.supabase_access_token
}

# ──────────────────────────────────────────────────────────────
# Supabase Project
# ──────────────────────────────────────────────────────────────

resource "supabase_project" "bonerbucks" {
  name            = var.app_name
  organization_id = var.supabase_org_id
  database_password = var.supabase_db_password
  region          = var.supabase_region

  lifecycle {
    # Prevent accidental destruction of the database in production.
    prevent_destroy = true
  }
}

# Wait for the project to be fully provisioned before reading outputs
data "supabase_project" "bonerbucks" {
  id = supabase_project.bonerbucks.id
}

# ──────────────────────────────────────────────────────────────
# Supabase Storage bucket — record images
# ──────────────────────────────────────────────────────────────
# NOTE: Storage bucket creation is handled by the SQL migration
# (supabase/migrations/001_init.sql) rather than Terraform because
# the Supabase provider does not yet expose bucket resources.
# The migration runs automatically on `supabase db push`.

# ──────────────────────────────────────────────────────────────
# Vercel Project
# ──────────────────────────────────────────────────────────────

resource "vercel_project" "bonerbucks" {
  name      = var.app_name
  framework = "nextjs"

  # Point at the repo root — adjust if you push to a subdirectory
  root_directory = null

  git_repository = null  # wire this up after creating the repo:
  # git_repository = {
  #   type = "github"
  #   repo = "yourorg/bonerbucks"
  # }

  # Ensure preview deployments don't inherit production secrets
  environment = [
    {
      key    = "NEXT_PUBLIC_SUPABASE_URL"
      value  = "https://${supabase_project.bonerbucks.id}.supabase.co"
      target = ["production", "preview", "development"]
    },
    {
      key    = "NEXT_PUBLIC_SUPABASE_ANON_KEY"
      value  = data.supabase_project.bonerbucks.anon_key
      target = ["production", "preview", "development"]
    },
    {
      key    = "SUPABASE_SERVICE_ROLE_KEY"
      value  = data.supabase_project.bonerbucks.service_role_key
      target = ["production"]  # never expose in preview/dev
    },
    {
      key    = "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
      value  = var.google_maps_api_key
      target = ["production", "preview", "development"]
    },
    {
      key    = "NEXT_PUBLIC_SITE_URL"
      value  = var.production_domain != "" ? "https://${var.production_domain}" : "https://${var.app_name}.vercel.app"
      target = ["production"]
    },
    {
      key    = "NEXT_PUBLIC_SITE_URL"
      value  = "https://${var.app_name}-git-main.vercel.app"
      target = ["preview"]
    },
  ]
}

# ──────────────────────────────────────────────────────────────
# Vercel Custom Domain (optional)
# ──────────────────────────────────────────────────────────────

resource "vercel_project_domain" "custom" {
  count      = var.production_domain != "" ? 1 : 0
  project_id = vercel_project.bonerbucks.id
  domain     = var.production_domain
}

resource "vercel_project_domain" "www_redirect" {
  count      = var.production_domain != "" ? 1 : 0
  project_id = vercel_project.bonerbucks.id
  domain     = "www.${var.production_domain}"

  redirect             = var.production_domain
  redirect_status_code = 308
}

# ──────────────────────────────────────────────────────────────
# Supabase Auth settings (PKCE + redirect allow-list)
# ──────────────────────────────────────────────────────────────
# The Supabase provider's `supabase_settings` resource controls
# auth configuration. Adjust allowed redirect URLs to match your
# deployed domain.

resource "supabase_settings" "auth" {
  project_ref = supabase_project.bonerbucks.id

  auth = jsonencode({
    site_url               = var.production_domain != "" ? "https://${var.production_domain}" : "https://${var.app_name}.vercel.app"
    additional_redirect_urls = compact([
      "http://localhost:3000/account",
      "https://${var.app_name}.vercel.app/account",
      var.production_domain != "" ? "https://${var.production_domain}/account" : "",
    ])
    disable_signup         = false
    jwt_expiry             = 3600
    mailer_autoconfirm     = false  # set to true to skip email confirmation in dev
    enable_email_signup    = true
    enable_anonymous_sign_ins = false
  })
}
