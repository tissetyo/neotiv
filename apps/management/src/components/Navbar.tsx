import Link from 'next/link'
import { Building2, Settings, UserCircle, LogOut, LayoutGrid } from 'lucide-react'
interface NavbarProps {
  userEmail: string
  role: string
}

export function Navbar({ userEmail, role }: NavbarProps) {
  const displayName = userEmail.split('@')[0]

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-primary text-white z-50 shadow-md">
      <div className="h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo & Primary Links */}
        <div className="flex items-center gap-8">
          <Link href="/hotels" className="flex items-center gap-2 text-white hover:text-accent-light transition-colors">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Building2 className="w-5 h-5 text-accent-light" />
            </div>
            <div>
              <span className="font-bold text-lg leading-none block tracking-tight">Neotiv</span>
              <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest block">Management Group</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 border-l border-white/10 pl-8 ml-2">
            <Link 
              href="/hotels" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white/10 text-white"
            >
              <LayoutGrid className="w-4 h-4" />
              Properties
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Organization Settings
            </Link>
          </div>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-text-muted capitalize">
              {role.replace('_', ' ')}
            </p>
          </div>
          
          <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <UserCircle className="w-5 h-5" />
            </button>
            <Link 
              href="/login"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-danger hover:bg-danger/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
      </div>
    </nav>
  )
}
