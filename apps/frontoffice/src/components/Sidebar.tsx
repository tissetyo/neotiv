'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LayoutDashboard, CalendarCheck, Users, Megaphone, Bell, LogOut, Settings } from 'lucide-react'
const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Room Overview' },
  { path: '/dashboard/services', icon: Settings, label: 'Hotel Services' },
  { path: '/check-in', icon: CalendarCheck, label: 'Check-in Guest' },
  { path: '/deals', icon: Megaphone, label: 'Deals Manager' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
]

interface SidebarProps {
  hotelName: string
  staffEmail: string
  role: string
}

export function Sidebar({ hotelName, staffEmail, role }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="sidebar justify-between">
      <div>
        <div className="sidebar-logo">
          <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-text-primary leading-tight">
              {hotelName}
            </h1>
            <p className="text-[11px] text-text-secondary font-medium">
              Front Office Panel
            </p>
          </div>
        </div>

        <nav className="py-6 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path))
            return (
              <Link 
                key={item.path} 
                href={item.path === '/check-in' ? '/check-in/new' : item.path}
                className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5 opacity-80" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-border-light p-4">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
            {staffEmail.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {staffEmail.split('@')[0]}
            </p>
            <p className="text-[11px] text-text-secondary font-medium capitalize truncate">
              {role.replace('_', ' ')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <Link href="/login" className="flex-1 flex items-center justify-center p-2 text-text-secondary hover:text-notification-red hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
