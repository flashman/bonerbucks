output "supabase_project_id" {
  description = "Supabase project reference ID"
  value       = supabase_project.bonerbucks.id
}

output "supabase_url" {
  description = "Supabase project API URL"
  value       = "https://${supabase_project.bonerbucks.id}.supabase.co"
}

output "supabase_studio_url" {
  description = "Supabase Studio dashboard URL"
  value       = "https://app.supabase.com/project/${supabase_project.bonerbucks.id}"
}

output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.bonerbucks.id
}

output "vercel_deployment_url" {
  description = "Default Vercel deployment URL"
  value       = "https://${var.app_name}.vercel.app"
}

output "production_url" {
  description = "Production URL (custom domain if set, otherwise Vercel default)"
  value       = var.production_domain != "" ? "https://${var.production_domain}" : "https://${var.app_name}.vercel.app"
}

output "next_steps" {
  description = "Post-apply checklist"
  value       = <<-EOT

    ┌─────────────────────────────────────────────────────────┐
    │          BONERBUCKS — POST-APPLY CHECKLIST              │
    └─────────────────────────────────────────────────────────┘

    1. RUN DATABASE MIGRATION
       cd .. && npx supabase db push --project-ref ${supabase_project.bonerbucks.id}

    2. COPY ENV FILE
       cp .env.example .env.local
       # Fill in the values printed above

    3. CONNECT GIT REPO TO VERCEL
       Uncomment git_repository in terraform/main.tf and re-apply,
       OR connect manually at https://vercel.com/new

    4. CONFIGURE GOOGLE MAPS API KEY
       - Enable: Maps JavaScript API, Geocoding API, Places API
       - Restrict key to your domain in production

    5. SET AN ADMIN USER
       After signing up, run in Supabase SQL editor:
         UPDATE profiles SET role = 1 WHERE name = 'yourusername';

    6. OPTIONAL: DNS FOR CUSTOM DOMAIN
       Point ${var.production_domain != "" ? var.production_domain : "<your-domain>"} →
         CNAME: cname.vercel-dns.com
         (or follow the instructions in Vercel dashboard)

  EOT
}
