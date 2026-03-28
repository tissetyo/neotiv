import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(
            ({ name, value, options }: { name: string; value: string; options: CookieOptions }) =>
              supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Only refresh the session cookie — do NOT add redirect logic here.
  // Auth guards live in each Server Component via supabase.auth.getUser().
  // Vercel Edge Runtime cannot reliably call getUser()/getSession() because
  // auth cookies may not be forwarded correctly to the edge layer.
  const { data: { session } } = await supabase.auth.getSession()

  const isLoginPage = request.nextUrl.pathname.startsWith('/login')

  // Redirect to login if accessing protected route without session
  if (!session && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if accessing login while already authenticated
  if (session && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
