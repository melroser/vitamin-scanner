'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, Search, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { scanBarcode } from '@/lib/scanner'


export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [manualSearch, setManualSearch] = useState('')
    const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  const [error, setError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
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

// --- Helpers: file -> dataURL and lossy downscale to keep payloads tiny ---
const fileToDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

/**
 * Downscale a data URL (PNG/JPEG/WebP) and re-encode as JPEG to shrink size.
 * @param dataUrl input image as data URL
 * @param maxDim  longest side target (px)
 * @param quality JPEG quality 0..1
 * @returns data URL (image/jpeg)
 */
async function compressDataURL(
  dataUrl: string,
  maxDim = 1600,
  quality = 0.85
): Promise<string> {
  const img = new Image()
  img.decoding = 'async'
  img.src = dataUrl

  // Safari fallback: use onload instead of img.decode()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = (e) => reject(e)
  })

  let { width, height } = img
  if (Math.max(width, height) > maxDim) {
    const scale = maxDim / Math.max(width, height)
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)

  // Force JPEG for best size; labels are mostly text so 0.75–0.9 is fine
  return canvas.toDataURL('image/jpeg', quality)
}


  async function onImageChosen(file: File) {
  try {
    setError('')
    setIsParsing(true)
    const raw = await fileToDataURL(file)
    const dataUrl = await compressDataURL(raw)
    setPreviewSrc(dataUrl)

    const res = await fetch('/.netlify/functions/read-label', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: dataUrl })
    })
    if (!res.ok) throw new Error(`Parse failed: ${res.status}`)
    const payload = await res.json()

    // store vitamins in sessionStorage under a random key
    const vitaminsId = crypto.randomUUID()
    sessionStorage.setItem(`vitamins:${vitaminsId}`, JSON.stringify(payload.vitamins))

    // now navigate — include whatever else you already pass (e.g., barcode)
    router.push(`/results?vitaminsId=${vitaminsId}`)
  } catch (e: any) {
    console.error(e)
    setError(e?.message || 'Could not parse image')
  } finally {
    setIsParsing(false)
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

        {/* NEW: Upload Nutrition Facts (optional) */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Upload Nutrition Facts (optional)</h2>
            <div className="space-y-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) onImageChosen(f)
                }}
                className="hidden"
              />
              <Button
                type="button"
                className="w-full"
                onClick={() => fileRef.current?.click()}
                disabled={isParsing}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isParsing ? 'Reading label…' : 'Upload Label Image'}
              </Button>
              {previewSrc && (
                <img
                  src={previewSrc}
                  alt="Preview"
                  className="mt-2 max-h-64 rounded border border-gray-200"
                />
              )}
              <p className="text-xs text-gray-500">
                Tip: crop to the Nutrition Facts panel for best results.
              </p>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
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
