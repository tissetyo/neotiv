import { Navbar } from '@/components/Navbar'
import { Building2, MapPin, Globe, Image as ImageIcon, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewHotelPage() {
  return (
    <>
      <Navbar />
      
      <main className="admin-container pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/hotels" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent font-medium mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
          
          <div className="mb-8 border-b border-border-light pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">Create New Property</h1>
            <p className="text-text-secondary">Set up a new hotel or resort within your organization. You will be able to add rooms and staff after creation.</p>
          </div>

          <form className="space-y-8">
            {/* General Info */}
            <div className="card">
              <h3 className="section-title flex items-center gap-2">
                <Building2 className="w-5 h-5 text-accent" />
                General Information
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="label">Property Name</label>
                  <input type="text" className="input" placeholder="e.g. Grand Sapphire Resort" required />
                </div>
                
                <div>
                  <label className="label flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-text-muted" /> Address
                  </label>
                  <textarea className="input min-h-[80px] resize-none" placeholder="Full street address..." required />
                </div>
                
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="label flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-text-muted" /> Timezone
                    </label>
                    <select className="input cursor-pointer" defaultValue="America/New_York">
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="card shadow-sm border-dashed">
              <h3 className="section-title flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-accent" />
                Branding & Imagery
              </h3>
              
              <div>
                <label className="label">Property Logo / Feature Image URL</label>
                <div className="flex gap-4">
                  <input type="url" className="input flex-1" placeholder="https://images.unsplash.com/..." />
                  <button type="button" className="btn-secondary whitespace-nowrap">Upload Image</button>
                </div>
                <p className="text-xs text-text-muted mt-2">This image will appear on the management dashboard and guest TV screens.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Link href="/hotels" className="btn-ghost font-medium">Cancel</Link>
              <button type="submit" className="btn-primary shadow-md shadow-accent/20 px-8">
                <Save className="w-4 h-4" />
                Create Property
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
