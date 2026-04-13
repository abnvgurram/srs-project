import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    'Supabase admin client is not fully configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Netlify.',
  )
}

export const hasSupabaseAdminConfig = Boolean(
  supabaseUrl && supabaseServiceRoleKey,
)

export const supabaseAdmin = hasSupabaseAdminConfig
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null
