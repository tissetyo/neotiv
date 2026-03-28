'use client'

import { useState, useEffect } from 'react'
import { CloudRain } from 'lucide-react'
import { mockDashboardData } from '@/data/mock-data'
import type { Deal } from '@neotiv/types'

// Setup spatial navigation
import { useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation'

// Widgets
import AnalogClocks from '@/components/widgets/AnalogClocks'
import DigitalClock from '@/components/widgets/DigitalClock'
import WifiQR from '@/components/widgets/WifiQR'
import NotificationCard from '@/components/widgets/NotificationCard'
import AlarmWidget from '@/components/widgets/AlarmWidget'
import MapPreview from '@/components/widgets/MapPreview'
import DealsBanner from '@/components/widgets/DealsBanner'
import AppTiles from '@/components/widgets/AppTiles'
import ServicesTile from '@/components/widgets/ServicesTile'
import TickerBar from '@/components/widgets/TickerBar'
import FlightSchedule from '@/components/widgets/FlightSchedule'
import FocusableTile from '@/components/widgets/FocusableTile'

// Overlays
import ChatOverlay from '@/components/overlays/ChatOverlay'
import ServicesModal from '@/components/overlays/ServicesModal'
import DealsModal from '@/components/overlays/DealsModal'
import AlarmSetModal from '@/components/overlays/AlarmSetModal'

export default function DashboardPage(): React.ReactElement {
  const data = mockDashboardData

  // Overlay states
  const [chatOpen, setChatOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [dealsOpen, setDealsOpen] = useState(false)
  const [alarmOpen, setAlarmOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | undefined>()

  const handleViewDeal = (deal: Deal): void => {
    setSelectedDeal(deal)
    setDealsOpen(true)
  }

  // Root focus node for spatial navigation
  const { ref: focusKeyRef } = useFocusable({
    focusKey: 'DASHBOARD_ROOT',
    isFocusBoundary: true
  })

  // Day/Night and Auto-focus
  const [isNight, setIsNight] = useState(false)
  
  useEffect(() => {
    // Set focus to the main widget
    setFocus('DASHBOARD_MAIN')
    
    // Day/Night logic based on time
    const checkTime = () => {
      const hour = new Date().getHours()
      setIsNight(hour < 6 || hour >= 18)
    }
    checkTime()
    const interval = setInterval(checkTime, 60000)
    return () => clearInterval(interval)
  }, [setFocus])

  const bgImage = data.session.backgroundUrl || 'https://images.unsplash.com/photo-1498092651296-641e88c3b057?auto=format&fit=crop&q=80&w=1920&h=1080'

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden" 
      ref={focusKeyRef}
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Day/Night Dynamic Overlay */}
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-1000 z-0 ${isNight ? 'bg-black/70' : 'bg-black/20'}`} />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/40 z-0" />

      {/* Main UI Container */}
      <div className="relative z-10 w-full h-full p-8 pb-14 flex flex-col gap-6">
        
        {/* TOP ROW: Clocks / Weather / Profile */}
        <div className="flex justify-between items-start h-[160px]">
          {/* Top Left: Clocks & Time */}
          <div className="flex gap-8 items-center">
            <AnalogClocks />
            <div className="flex flex-col gap-1 ml-4 shadow-black/50 drop-shadow-lg">
              <div className="flex items-center gap-2 text-white/90 text-xl font-medium">
                <CloudRain className="w-6 h-6" />
                <span>24°C • Kuta, Bali</span>
              </div>
              <DigitalClock />
            </div>
          </div>

          {/* Top Right: Profile & Room */}
          <div className="flex gap-8 items-start h-full">
            <div className="flex items-center gap-6 drop-shadow-lg">
              <div className="text-right">
                <p className="text-xl text-white/90">Hello</p>
                <h2 className="text-2xl font-bold bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg mt-1">
                  {data.session.guestName}
                </h2>
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200" 
                  alt="Guest" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="h-20 w-px bg-white/20 mx-2" />
            
            <div className="text-center drop-shadow-lg pr-4">
              <p className="text-xl text-white/90">Room</p>
              <h2 className="text-4xl font-bold mt-1">{data.room.number}</h2>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="flex gap-6 mt-4 items-stretch h-[320px]">
          <FocusableTile focusKey="DASHBOARD_MAIN" className="flex-1 min-w-0 flex flex-col">
            <FlightSchedule />
          </FocusableTile>

          <div className="flex flex-col gap-6 w-[340px] shrink-0">
            <FocusableTile className="min-h-0 flex-1 flex flex-col">
              <WifiQR ssid={data.wifiSSID} password={data.wifiPassword} />
            </FocusableTile>
            
            <FocusableTile className="min-h-0 flex-1 flex flex-col">
              <NotificationCard notifications={data.notifications} />
            </FocusableTile>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex-1 flex gap-6 mt-4 min-h-0">
          
          <FocusableTile className="w-[280px] shrink-0 flex flex-col" onClick={() => setDealsOpen(true)}>
             <DealsBanner deals={data.deals} onViewDeal={handleViewDeal} />
          </FocusableTile>

          <FocusableTile className="w-[240px] shrink-0" onClick={() => setServicesOpen(true)}>
            <ServicesTile services={data.services} onOpenServices={() => setServicesOpen(true)} />
          </FocusableTile>

          <FocusableTile className="w-[280px] shrink-0 flex flex-col">
            <MapPreview hotelAddress={data.hotel.address || 'Hotel Location'} />
          </FocusableTile>

          <div className="flex-1 flex gap-6 min-w-0">
            <div className="flex-1 min-w-0">
               <AppTiles />
            </div>
            
            <div className="flex flex-col gap-4 shrink-0 justify-between">
              <FocusableTile className="h-[80px] w-[80px] rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center border border-white/20">
                <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
              </FocusableTile>
              <FocusableTile className="h-[80px] w-[80px] rounded-2xl glass-card flex items-center justify-center shrink-0" onClick={() => setChatOpen(true)}>
                 <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </FocusableTile>
              <FocusableTile className="h-[80px] w-[80px] rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center shrink-0" onClick={() => setAlarmOpen(true)}>
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </FocusableTile>
            </div>
          </div>
        </div>

      </div>

      {/* Ticker Bar — Full Width Bottom */}
      <TickerBar notifications={data.notifications} hotelName={data.hotel.name} />

      {/* ── Overlays ──────────────────────────────────────── */}
      <ChatOverlay
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={data.chatMessages}
        guestName={data.session.guestName}
      />
      <ServicesModal
        isOpen={servicesOpen}
        onClose={() => setServicesOpen(false)}
        services={data.services}
      />
      <DealsModal
        isOpen={dealsOpen}
        onClose={() => setDealsOpen(false)}
        deals={data.deals}
        initialDeal={selectedDeal}
      />
      <AlarmSetModal
        isOpen={alarmOpen}
        onClose={() => setAlarmOpen(false)}
      />
    </div>
  )
}
