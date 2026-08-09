'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface OnboardingData {
  // Step 1: Business Profile
  companyName: string
  industry: string
  website: string
  companySize: string
  logo: string

  // Step 2: Marketing Context
  currentChannels: string[]
  monthlyBudget: string
  painPoints: string
  marketingGoals: string[]
  targetAudience: string
  competitors: string

  // Step 3: Assets & Access
  instagram: string
  facebook: string
  twitter: string
  linkedin: string
  tiktok: string
  brandPrimaryColor: string
  brandSecondaryColor: string
  brandVoice: string
}

const industries = [
  'E-commerce',
  'SaaS / Technology',
  'Healthcare',
  'Finance / Banking',
  'Real Estate',
  'Education',
  'Food & Beverage',
  'Retail',
  'Manufacturing',
  'Professional Services',
  'Other',
]

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees',
]

const budgetRanges = [
  'Less than $1,000/mo',
  '$1,000 - $5,000/mo',
  '$5,000 - $10,000/mo',
  '$10,000 - $25,000/mo',
  '$25,000 - $50,000/mo',
  '$50,000+/mo',
]

const marketingChannels = [
  'Social Media',
  'Email Marketing',
  'PPC / Paid Ads',
  'Content Marketing',
  'SEO',
  'Influencer Marketing',
  'None (Starting fresh)',
]

const marketingGoals = [
  'Lead Generation',
  'Brand Awareness',
  'Sales / Conversions',
  'Customer Retention',
  'Website Traffic',
  'App Downloads',
]

const brandVoices = [
  'Professional',
  'Casual',
  'Friendly',
  'Authoritative',
  'Playful',
  'Luxurious',
  'Technical',
]

export default function OnboardPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<OnboardingData>({
    companyName: '',
    industry: '',
    website: '',
    companySize: '',
    logo: '',
    currentChannels: [],
    monthlyBudget: '',
    painPoints: '',
    marketingGoals: [],
    targetAudience: '',
    competitors: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    tiktok: '',
    brandPrimaryColor: '#000000',
    brandSecondaryColor: '#ffffff',
    brandVoice: '',
  })

  // Check if user is logged in
  useEffect(() => {
    const userId = localStorage.getItem('adroit-user-id')
    if (!userId) {
      router.push('/login')
    }
  }, [router])

  const updateFormData = (field: keyof OnboardingData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: 'currentChannels' | 'marketingGoals', item: string) => {
    setFormData((prev) => {
      const arr = prev[field]
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
      }
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Get wallet info from localStorage
      const walletAddress = localStorage.getItem('circle-wallet-address')
      const walletId = localStorage.getItem('circle-wallet-id')
      
      if (!walletAddress) {
        console.error('No wallet address found')
        return
      }

      // Save onboarding data to database
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-onboarding',
          walletAddress,
          walletId,
          data: {
            wallet_address: walletAddress,
            wallet_id: walletId,
            company_name: formData.companyName,
            industry: formData.industry,
            website: formData.website,
            company_size: formData.companySize,
            marketing_channels: JSON.stringify(formData.currentChannels),
            monthly_budget: formData.monthlyBudget,
            goals: JSON.stringify(formData.marketingGoals),
            target_audience: formData.targetAudience,
            pain_points: formData.painPoints,
            competitors: formData.competitors,
            brand_primary_color: formData.brandPrimaryColor,
            brand_secondary_color: formData.brandSecondaryColor,
            brand_voice: formData.brandVoice,
            instagram: formData.instagram,
            facebook: formData.facebook,
            twitter: formData.twitter,
            linkedin: formData.linkedin,
            tiktok: formData.tiktok,
          },
        }),
      })
      
      if (res.ok) {
        // Mark onboarding as complete
        localStorage.setItem('adroit-onboarding-complete', 'true')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Onboarding failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / 3) * 100

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form card */}
        <div className="glass rounded-2xl p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Business Profile</h2>
                <p className="text-white/60">Tell us about your business</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    placeholder="Acme Corp"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Industry *</Label>
                  <Select value={formData.industry} onValueChange={(v) => updateFormData('industry', v || '')}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL *</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Size *</Label>
                  <Select value={formData.companySize} onValueChange={(v) => updateFormData('companySize', v || '')}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Marketing Context</h2>
                <p className="text-white/60">Help us understand your marketing needs</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Marketing Channels</Label>
                  <div className="flex flex-wrap gap-2">
                    {marketingChannels.map((channel) => (
                      <button
                        key={channel}
                        type="button"
                        onClick={() => toggleArrayItem('currentChannels', channel)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          formData.currentChannels.includes(channel)
                            ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                            : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {channel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Marketing Budget *</Label>
                  <Select value={formData.monthlyBudget} onValueChange={(v) => updateFormData('monthlyBudget', v || '')}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Marketing Goals *</Label>
                  <div className="flex flex-wrap gap-2">
                    {marketingGoals.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleArrayItem('marketingGoals', goal)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          formData.marketingGoals.includes(goal)
                            ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                            : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Textarea
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => updateFormData('targetAudience', e.target.value)}
                    placeholder="Describe your ideal customers (age, interests, demographics)"
                    className="bg-white/5 border-white/10 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="painPoints">Main Marketing Challenges</Label>
                  <Textarea
                    id="painPoints"
                    value={formData.painPoints}
                    onChange={(e) => updateFormData('painPoints', e.target.value)}
                    placeholder="What are your biggest marketing pain points?"
                    className="bg-white/5 border-white/10 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitors">Key Competitors</Label>
                  <Input
                    id="competitors"
                    value={formData.competitors}
                    onChange={(e) => updateFormData('competitors', e.target.value)}
                    placeholder="competitor1.com, competitor2.com"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Assets & Brand</h2>
                <p className="text-white/60">Connect your social accounts and brand identity</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Social Media Handles</Label>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/50 w-24">Instagram</span>
                      <Input
                        value={formData.instagram}
                        onChange={(e) => updateFormData('instagram', e.target.value)}
                        placeholder="@yourhandle"
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/50 w-24">Facebook</span>
                      <Input
                        value={formData.facebook}
                        onChange={(e) => updateFormData('facebook', e.target.value)}
                        placeholder="facebook.com/yourpage"
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/50 w-24">Twitter / X</span>
                      <Input
                        value={formData.twitter}
                        onChange={(e) => updateFormData('twitter', e.target.value)}
                        placeholder="@yourhandle"
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/50 w-24">LinkedIn</span>
                      <Input
                        value={formData.linkedin}
                        onChange={(e) => updateFormData('linkedin', e.target.value)}
                        placeholder="linkedin.com/company/yourcompany"
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/50 w-24">TikTok</span>
                      <Input
                        value={formData.tiktok}
                        onChange={(e) => updateFormData('tiktok', e.target.value)}
                        placeholder="@yourhandle"
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Brand Colors</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/50">Primary</span>
                      <input
                        type="color"
                        value={formData.brandPrimaryColor}
                        onChange={(e) => updateFormData('brandPrimaryColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent border border-white/10"
                      />
                      <span className="text-sm text-white/40">{formData.brandPrimaryColor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/50">Secondary</span>
                      <input
                        type="color"
                        value={formData.brandSecondaryColor}
                        onChange={(e) => updateFormData('brandSecondaryColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent border border-white/10"
                      />
                      <span className="text-sm text-white/40">{formData.brandSecondaryColor}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Brand Voice *</Label>
                  <Select value={formData.brandVoice} onValueChange={(v) => updateFormData('brandVoice', v || '')}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10">
                      <SelectValue placeholder="Select brand voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandVoices.map((voice) => (
                        <SelectItem key={voice} value={voice}>
                          {voice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            {step > 1 ? (
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                className="text-white/70 hover:text-white"
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
