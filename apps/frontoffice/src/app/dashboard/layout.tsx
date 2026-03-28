import { Sidebar } from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch hotel info and user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*, hotels(name)')
    .eq('auth_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-bg-body">
      <Sidebar 
        hotelName={(profile?.hotels as any)?.name || 'Neotiv Hotel'} 
        staffEmail={user.email!}
        role={profile?.role || 'front_office'}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
