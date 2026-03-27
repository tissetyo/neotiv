'use client'

import { Youtube, Music, Tv, Play, Film, Globe, Smartphone } from 'lucide-react'

import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'

type AppTile = {
  name: string
  icon: React.ReactNode
  gradient: string
  url?: string
}

const APPS: AppTile[] = [
  {
    name: 'YouTube',
    icon: <Youtube className="w-8 h-8" />,
    gradient: 'from-red-600 to-red-800',
    url: 'https://youtube.com',
  },
  {
    name: 'Netflix',
    icon: <Play className="w-8 h-8" />,
    gradient: 'from-red-800 to-black',
    url: 'https://netflix.com',
  },
  {
    name: 'Disney+',
    icon: <Film className="w-8 h-8" />,
    gradient: 'from-blue-700 to-blue-900',
    url: 'https://disneyplus.com',
  },
  {
    name: 'Spotify',
    icon: <Music className="w-8 h-8" />,
    gradient: 'from-green-600 to-green-800',
    url: 'https://spotify.com',
  },
  {
    name: 'TikTok',
    icon: <Smartphone className="w-8 h-8" />,
    gradient: 'from-pink-600 via-purple-600 to-blue-600',
    url: 'https://tiktok.com',
  },
  {
    name: 'Prime',
    icon: <Tv className="w-8 h-8" />,
    gradient: 'from-sky-500 to-sky-700',
    url: 'https://primevideo.com',
  },
  {
    name: 'Live TV',
    icon: <Tv className="w-8 h-8" />,
    gradient: 'from-indigo-600 to-indigo-800',
  },
  {
    name: 'Browser',
    icon: <Globe className="w-8 h-8" />,
    gradient: 'from-teal-600 to-teal-800',
  },
]

function FocusableApp({ app }: { app: AppTile }): React.ReactElement {
  const { ref, focused } = useFocusable({
    onEnterPress: () => app.url && window.open(app.url, '_blank'),
  })

  return (
    <button
      ref={ref}
      className={`focus-tv flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${app.gradient} 
        transition-transform duration-300 ${focused ? 'ring-4 ring-white scale-110 z-50 shadow-2xl shadow-black/50' : 'hover:scale-105'}
        focus:outline-none focus:ring-offset-0`}
      onClick={() => app.url && window.open(app.url, '_blank')}
    >
      {app.icon}
      <span className="text-xs font-medium text-white/90 truncate w-full text-center">
        {app.name}
      </span>
    </button>
  )
}

export default function AppTiles(): React.ReactElement {
  return (
    <div className="h-full">
      <div className="grid grid-cols-4 gap-3">
        {APPS.map((app) => (
          <FocusableApp key={app.name} app={app} />
        ))}
      </div>
    </div>
  )
}
