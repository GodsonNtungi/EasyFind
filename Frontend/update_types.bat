
set SUPABASE_URL=https://jjdolflrjdwfsfcizqvk.supabase.co
set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZG9sZmxyamR3ZnNmY2l6cXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY0Njc2ODgsImV4cCI6MTk4MjA0MzY4OH0.7OnIlAlEIwqlpxxucV7fbFEypyZDVLbATWVHJb_PNM8

npx openapi-typescript %SUPABASE_URL%/rest/v1/?apikey="%SUPABASE_ANON_KEY%" --version=2 --output types/database/index.ts

# run file using bash update_types.sh
