'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Scan } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getProductData, getRecommendations, compareVitamins } from '@/lib/data'

interface VitaminResult {
  name: string
  productAmount: string
  recommendedAmount: string
  status: 'good' | 'low' | 'high'
  statusText: string
}

type Product = { name: string; vitamins: Record<string, string> }

// Template used when we only have OCR vitamins
const PRODUCT_TEMPLATE: Record<string, string> = {
  'Vitamin A': '3500 IU',
  'Molybdenum': '50 mcg'
}

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [vitamins, setVitamins] = useState<Record<string, string> | null>(null)
  const [productName, setProductName] = useState('')
  const [results, setResults] = useState<VitaminResult[]>([])
  const [overallStatus, setOverallStatus] = useState<'good' | 'caution' | 'poor'>('good')
  const [loading, setLoading] = useState(true)

  // 1) Load OCR vitamins from sessionStorage
  useEffect(() => {
    const vitaminsId = searchParams.get('vitaminsId')
    if (!vitaminsId) { setVitamins(null); return }
    const raw = sessionStorage.getItem(`vitamins:${vitaminsId}`)
    setVitamins(raw ? JSON.parse(raw) : null)
  }, [searchParams])

  // 2) Build product + compute results whenever params or vitamins change
  useEffect(() => {
    const profile = localStorage.getItem('vitaminProfile')
    if (!profile) { router.push('/profile'); return }
    const userProfile = JSON.parse(profile)

    const barcode = searchParams.get('barcode')
    const search = searchParams.get('search')

    let base: Product | null = null
    if (barcode) base = getProductData(barcode)
    else if (search) base = getProductData(search, 'name')

    // If no DB product but OCR vitamins exist, start from template
    if (!base && vitamins) {
      base = { name: 'Unknown', vitamins: { ...PRODUCT_TEMPLATE } }
    }

    // Merge OCR vitamins on top (OCR overrides)
    if (base && vitamins) {
      base = {
        name: base.name || 'Unknown',
        vitamins: { ...base.vitamins, ...vitamins }
      }
    }

    setProductName(base?.name ?? (barcode || search ? 'Product not found' : 'Unknown'))

    if (base) {
      const recommendations = getRecommendations(userProfile)
      const comparison = compareVitamins(base.vitamins, recommendations)
      setResults(comparison)

      const lowCount = comparison.filter(v => v.status === 'low').length
      const highCount = comparison.filter(v => v.status === 'high').length
      setOverallStatus(highCount > 0 ? 'caution' : lowCount > 2 ? 'poor' : 'good')
    } else {
      setResults([])
      setOverallStatus('good')
    }

    setLoading(false)
  }, [searchParams, vitamins, router])

  // Optional: inspect OCR vitamins
  useEffect(() => {
    if (vitamins) console.log('Vitamins (from results):', vitamins)
  }, [vitamins])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'low':  return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'high': return <XCircle className="w-5 h-5 text-red-600" />
      default:     return null
    }
  }

  const getOverallMessage = () => {
    switch (overallStatus) {
      case 'good':    return 'This supplement is a good match for your needs'
      case 'caution': return 'Caution: Some vitamins exceed recommended levels'
      case 'poor':    return 'This supplement may not meet your nutritional needs'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Analyzing supplement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Results</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">{productName}</h2>
          <div
            className={`p-3 rounded-lg ${
              overallStatus === 'good'
                ? 'bg-green-50 text-green-800'
                : overallStatus === 'caution'
                ? 'bg-yellow-50 text-yellow-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            <p className="font-medium">{getOverallMessage()}</p>
          </div>
        </Card>

        {results.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Vitamin Analysis</h3>
            <div className="space-y-4">
              {results.map((vitamin, index) => (
                <motion.div
                  key={vitamin.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  {getStatusIcon(vitamin.status)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">{vitamin.name}</h4>
                    <p className="text-sm text-gray-600">
                      Product: {vitamin.productAmount} | You need: {vitamin.recommendedAmount}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        vitamin.status === 'good'
                          ? 'text-green-600'
                          : vitamin.status === 'low'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {vitamin.statusText}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        <Button onClick={() => router.push('/scan')} className="w-full" size="lg">
          <Scan className="w-4 h-4 mr-2" />
          Scan Another Product
        </Button>
      </motion.div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
