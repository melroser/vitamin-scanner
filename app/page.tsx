'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Pill, User, Scan } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const [hasProfile, setHasProfile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const profile = localStorage.getItem('vitaminProfile')
    setHasProfile(!!profile)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <Pill className="w-12 h-12 text-blue-600" />
          </div>
        </div>
       
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Vitamin Scanner
          </h1>
          <p className="text-gray-600 max-w-sm">
            Scan supplements and get personalized recommendations based on your needs
          </p>
        </div>

        <div className="space-y-3 w-full max-w-xs mx-auto">
          {!hasProfile ? (
            <Button 
              onClick={() => router.push('/profile')}
              className="w-full"
              size="lg"
            >
              <User className="w-4 h-4 mr-2" />
              Set Up Profile
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => router.push('/scan')}
                className="w-full"
                size="lg"
              >
                <Scan className="w-4 h-4 mr-2" />
                Scan Supplement
              </Button>
              <Button 
                onClick={() => router.push('/profile')}
                variant="outline"
                className="w-full"
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
