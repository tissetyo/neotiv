import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.warn('Supabase URL or Anon Key is missing. Check your environment variables.')
    }
    // Return a dummy client so the app doesn't immediately crash during SSR
    return createSupabaseClient('https://placeholder.supabase.co', 'placeholder')
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export type SupabaseClient = ReturnType<typeof createClient>
