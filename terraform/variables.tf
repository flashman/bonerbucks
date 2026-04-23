# ──────────────────────────────────────────────────────────────
# Bonerbucks — Terraform Variables
# Copy terraform.tfvars.example → terraform.tfvars and fill in.
# Never commit terraform.tfvars (it contains secrets).
# ──────────────────────────────────────────────────────────────

variable "vercel_api_token" {
  description = "Vercel personal access token — https://vercel.com/account/tokens"
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "Vercel team ID (leave empty for personal account)"
  type        = string
  default     = ""
}

variable "supabase_access_token" {
  description = "Supabase management API token — https://app.supabase.com/account/tokens"
  type        = string
  sensitive   = true
}

variable "supabase_org_id" {
  description = "Supabase organization ID (visible in org settings URL)"
  type        = string
}

variable "supabase_db_password" {
  description = "Postgres database password for the Supabase project"
  type        = string
  sensitive   = true
}

variable "supabase_region" {
  description = "Supabase project region"
  type        = string
  default     = "us-west-1"
}

variable "google_maps_api_key" {
  description = "Google Maps JavaScript API key (restrict to your domain in production)"
  type        = string
  sensitive   = true
}

variable "app_name" {
  description = "Project slug used across Vercel and Supabase"
  type        = string
  default     = "bonerbucks"
}

variable "production_domain" {
  description = "Custom domain to attach to the Vercel project (optional, leave empty to skip)"
  type        = string
  default     = ""
}
