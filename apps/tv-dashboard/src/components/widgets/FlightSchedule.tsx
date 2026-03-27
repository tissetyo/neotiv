'use client'

import { PlaneTakeoff } from 'lucide-react'
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'

type Flight = {
  id: string
  airline: string
  flightNo: string
  time: string
  destination: string
  gate: string
  status: 'ON SCHEDULE' | 'GATE OPEN' | 'LAST CALL' | 'DELAY' | 'CLOSED' | 'CHECK-IN'
}

const mockFlights: Flight[] = [
  { id: '1', airline: 'Citilink', flightNo: 'KL-123', time: '19:15', destination: 'Jakarta', gate: '10', status: 'LAST CALL' },
  { id: '2', airline: 'Citilink', flightNo: 'KL-124', time: '19:15', destination: 'Jakarta', gate: '10', status: 'CLOSED' },
  { id: '3', airline: 'Citilink', flightNo: 'KL-125', time: '19:15', destination: 'Jakarta', gate: '10', status: 'ON SCHEDULE' },
  { id: '4', airline: 'Citilink', flightNo: 'KL-126', time: '19:15', destination: 'Jakarta', gate: '10', status: 'GATE OPEN' },
  { id: '5', airline: 'Citilink', flightNo: 'KL-127', time: '19:15', destination: 'Jakarta', gate: '10', status: 'DELAY' },
  { id: '6', airline: 'Citilink', flightNo: 'KL-128', time: '19:15', destination: 'Jakarta', gate: '10', status: 'CHECK-IN' },
  { id: '7', airline: 'Citilink', flightNo: 'KL-129', time: '19:15', destination: 'Jakarta', gate: '10', status: 'ON SCHEDULE' },
]

function getStatusColor(status: Flight['status']) {
  switch (status) {
    case 'ON SCHEDULE': return 'text-white font-bold'
    case 'GATE OPEN': return 'text-green-400 font-bold'
    case 'LAST CALL': return 'text-red-400 font-bold animate-pulse'
    case 'CLOSED': return 'text-red-600 font-bold'
    case 'DELAY': return 'text-orange-400 font-bold'
    case 'CHECK-IN': return 'text-green-500 font-bold'
    default: return 'text-white'
  }
}

export default function FlightSchedule(): React.ReactElement {
  const { ref, focused } = useFocusable()

  return (
    <div 
      ref={ref}
      className={`glass-card h-full flex flex-col focus-tv ${focused ? 'ring-4 ring-white' : ''}`}
      data-sn-focused={focused}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <PlaneTakeoff className="w-5 h-5 text-white" />
          <h2 className="text-sm tracking-wider uppercase font-semibold text-white">Flight Schedule</h2>
        </div>
        <div className="bg-primary/30 px-3 py-1 rounded-full border border-primary/50">
          <span className="text-[10px] uppercase font-bold text-white tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-light inline-block" />
            I Gusti Ngurah Rai
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[11px] text-white/50 uppercase tracking-wider">
              <th className="pb-3 px-2 font-medium">Flight</th>
              <th className="pb-3 px-2 font-medium">Time</th>
              <th className="pb-3 px-2 font-medium">Destination</th>
              <th className="pb-3 px-2 font-medium">Gate</th>
              <th className="pb-3 px-2 font-medium">Remarks</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {mockFlights.map((flight, idx) => (
              <tr 
                key={flight.id} 
                className={`border-b border-white/5 transition-colors ${idx % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
              >
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-green-500 italic uppercase">{flight.airline}</span>
                    <span className="text-white/80 text-[13px]">{flight.flightNo}</span>
                  </div>
                </td>
                <td className="py-2.5 px-2 text-white/90 font-mono text-[13px]">{flight.time}</td>
                <td className="py-2.5 px-2 text-white/90 text-[13px]">{flight.destination}</td>
                <td className="py-2.5 px-2 text-white/70 text-[13px]">{flight.gate}</td>
                <td className="py-2.5 px-2">
                  <span className={`text-[11px] tracking-wider ${getStatusColor(flight.status)}`}>
                    {flight.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
