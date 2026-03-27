'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Wifi } from 'lucide-react'

type WifiQRProps = {
  ssid: string
  password: string
}

export default function WifiQR({ ssid, password }: WifiQRProps): React.ReactElement {
  const wifiString = `WIFI:T:WPA;S:${ssid};P:${password};;`

  return (
    <div className="glass-card">
      <span className="widget-title">WiFi Access</span>
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-lg p-2">
          <QRCodeSVG
            value={wifiString}
            size={72}
            bgColor="#ffffff"
            fgColor="#0a0a0a"
            level="M"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Wifi className="w-3.5 h-3.5 text-primary-light" />
            <span className="text-xs text-white/50">Network</span>
          </div>
          <p className="text-sm font-semibold text-white truncate">{ssid}</p>
          <div className="mt-2">
            <span className="text-xs text-white/50">Password</span>
            <p className="text-sm font-mono text-white/80">{password}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
