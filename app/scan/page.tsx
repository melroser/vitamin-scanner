'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { scanBarcode } from '@/lib/scanner'

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [manualSearch, setManualSearch] = useState('')
  const [error, setError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    const profile = localStorage.getItem('vitaminProfile')
    if (!profile) {
      router.push('/profile')
    }
  }, [router])

  const startScanning = async () => {
    try {
      setError('')
      setIsScanning(true)
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Initialize barcode scanner
      const result = await scanBarcode(videoRef.current!)
      if (result) {
        stopScanning()
        router.push(`/results?barcode=${result}`)
      }
    } catch (err) {
      setError('Camera access denied or not available')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
    setIsScanning(false)
  }

  const handleManualSearch = () => {
    if (manualSearch.trim()) {
      router.push(`/results?search=${encodeURIComponent(manualSearch)}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Scan Supplement</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Barcode Scanner</h2>
            
            {!isScanning ? (
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-600">Point camera at barcode</p>
                  </div>
                </div>
                <Button onClick={startScanning} className="w-full" size="lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Scanning
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-48 object-cover"
                    playsInline
                    muted
                  />
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-16 border-2 border-white rounded"></div>
                  </div>
                </div>
                <Button onClick={stopScanning} variant="outline" className="w-full">
                  Stop Scanning
                </Button>
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Manual Search</h2>
            <div className="space-y-3">
              <Input
                placeholder="Enter product name..."
                value={manualSearch}
                onChange={(e) => setManualSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
              />
              <Button 
                onClick={handleManualSearch} 
                className="w-full"
                disabled={!manualSearch.trim()}
              >
                <Search className="w-4 h-4 mr-2" />
                Search Product
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
