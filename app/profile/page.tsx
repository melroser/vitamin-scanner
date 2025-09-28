'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function ProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',       // string is fine; convert to number when saving if needed
  sex: 'female' // 'male' | 'female'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission (store to localStorage as other pages expect)
    localStorage.setItem('vitaminProfile', JSON.stringify(formData))
    router.push('/')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto p-4 max-w-2xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      <Card className="p-6">
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label htmlFor="name" className="block text-sm font-medium mb-1">
        Name
      </label>
      <Input
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your name"
      />
    </div>

    <div>
      <label htmlFor="email" className="block text-sm font-medium mb-1">
        Email
      </label>
      <Input
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
      />
    </div>

    {/* NEW: Age */}
    <div>
      <label htmlFor="age" className="block text-sm font-medium mb-1">
        Age (years)
      </label>
      <Input
        id="age"
        name="age"
        type="number"
        inputMode="decimal"
        step="0.1"
        min="0"
        value={formData.age}
        onChange={handleChange}
        placeholder="e.g., 34 or 0.5 for 6 months"
      />
      <p className="mt-1 text-xs text-gray-500">
        You can enter decimals (e.g., 0.5 = 6 months).
      </p>
    </div>

    <div>
  <label htmlFor="sex" className="block text-sm font-medium mb-1">
    Gender
  </label>
  <select
    id="sex"
    name="sex"
    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    value={formData.sex}
    onChange={(e) => setFormData((p) => ({ ...p, sex: e.target.value as 'male' | 'female' }))}
  >
    <option value="female">Female</option>
    <option value="male">Male</option>
  </select>
</div>


    <div className="flex justify-end">
      <Button type="submit">
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  </form>
</Card>

    </motion.div>
  )
}