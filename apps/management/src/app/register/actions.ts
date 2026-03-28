'use server'

import { createClient } from '@/lib/supabase/server'

export async function checkSlugAction(slug: string) {
  const supabase = createClient()
  const { data } = await supabase.from('hotels').select('id').eq('slug', slug).maybeSingle()
  return { available: !data }
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const orgName = formData.get('orgName') as string
  const hotelName = formData.get('hotelName') as string
  const hotelSlug = formData.get('hotelSlug') as string
  const hotelAddress = formData.get('hotelAddress') as string
  
  const supabase = createClient()

  // 1. Check if slug is already taken (defensive check before signUp)
  const { data: existingSlug } = await supabase.from('hotels').select('id').eq('slug', hotelSlug).maybeSingle()
  if (existingSlug) {
    return { error: 'Dashboard URL is already taken. Please choose another one.' }
  }

  // 2. Sign up the user (Since auto-confirm email is off or auto-login is on, they are logged in if successful)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  // If Supabase is set to require email confirmation, session might be null.
  // We handle both cases gracefully.
  if (authError) return { error: authError.message }
  if (!authData.user) return { error: 'Failed to create user account' }

  // 3. Call the atomic RPC to register tenant details safely, bypassing RLS using SECURITY DEFINER
  const { data: rpcResult, error: rpcError } = await supabase.rpc('register_new_tenant', {
    p_email: email,
    p_first_name: firstName,
    p_last_name: lastName,
    p_org_name: orgName,
    p_hotel_name: hotelName,
    p_hotel_slug: hotelSlug,
    p_hotel_address: hotelAddress
  })

  if (rpcError) {
    return { error: `Failed to secure organization setup: ${rpcError.message}` }
  }

  return { success: true, hotelSlug: hotelSlug, requiresEmailConfirmation: authData.session === null }
}
