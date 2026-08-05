"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Globe, Apple, Share2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<"email" | "social">("social")

  const handleSocialLogin = async (provider: "google" | "apple" | "facebook") => {
    setLoading(true)
    // In production, this would redirect to Circle's OAuth flow
    // For now, simulate login
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Store user session
    localStorage.setItem("adroit-user-id", `user-${Date.now()}`)
    localStorage.setItem("adroit-auth-method", provider)

    router.push("/dashboard")
  }

  const handleEmailLogin = async () => {
    if (!email) return
    setLoading(true)

    // In production, this would send OTP to email
    await new Promise(resolve => setTimeout(resolve, 1000))

    localStorage.setItem("adroit-user-id", `user-${email}`)
    localStorage.setItem("adroit-auth-method", "email")

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Adroit<span className="text-blue-500">.</span>
          </h1>
          <p className="text-white/60 mt-2">AI Marketing Agency</p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
              >
                <Globe className="h-5 w-5" />
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => handleSocialLogin("apple")}
                disabled={loading}
              >
                <Apple className="h-5 w-5" />
                Continue with Apple
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => handleSocialLogin("facebook")}
                disabled={loading}
              >
                <Share2 className="h-5 w-5" />
                Continue with Facebook
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Email Login */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleEmailLogin}
                disabled={loading || !email}
              >
                {loading ? "Sending OTP..." : "Continue with Email"}
              </Button>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </CardContent>
        </Card>

        {/* Wallet Info */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          Your wallet will be created automatically. You control your keys.
        </p>
      </div>
    </div>
  )
}
