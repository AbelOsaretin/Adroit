"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Globe, Apple, Share2, Loader2 } from "lucide-react"

const appId = process.env.NEXT_PUBLIC_CIRCLE_APP_ID || ""

type LoginResult = {
  userToken: string
  encryptionKey: string
}

type Wallet = {
  id: string
  address: string
  blockchain: string
  [key: string]: unknown
}

export default function LoginPage() {
  const router = useRouter()
  const sdkRef = useRef<any>(null)

  const [sdkReady, setSdkReady] = useState(false)
  const [deviceId, setDeviceId] = useState<string>("")
  const [status, setStatus] = useState<string>("Initializing...")
  const [loading, setLoading] = useState(false)

  const [deviceToken, setDeviceToken] = useState<string>("")
  const [deviceEncryptionKey, setDeviceEncryptionKey] = useState<string>("")

  const [loginResult, setLoginResult] = useState<LoginResult | null>(null)
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [wallets, setWallets] = useState<Wallet[]>([])

  // Initialize SDK on mount
  useEffect(() => {
    let cancelled = false

    const initSdk = async () => {
      try {
        const { W3SSdk } = await import("@circle-fin/w3s-pw-web-sdk")

        const onLoginComplete = (error: unknown, result: any) => {
          if (cancelled) return

          if (error) {
            const err = error as any
            console.error("Login failed:", err)
            setStatus("Login failed: " + (err.message || "Unknown error"))
            return
          }

          setLoginResult({
            userToken: result.userToken,
            encryptionKey: result.encryptionKey,
          })
          setStatus("Login successful! Click 'Initialize User' to continue.")
        }

        const sdk = new W3SSdk(
          {
            appSettings: { appId },
          },
          onLoginComplete
        )

        sdkRef.current = sdk

        if (!cancelled) {
          setSdkReady(true)
          setStatus("Ready. Click 'Create Device Token' to start.")
        }
      } catch (err) {
        console.error("Failed to initialize SDK:", err)
        if (!cancelled) {
          setStatus("Failed to initialize Circle SDK")
        }
      }
    }

    void initSdk()

    return () => {
      cancelled = true
    }
  }, [])

  // Get deviceId
  useEffect(() => {
    const fetchDeviceId = async () => {
      if (!sdkRef.current) return

      try {
        const cached = localStorage.getItem("circle-deviceId")
        if (cached) {
          setDeviceId(cached)
          return
        }

        const id = await sdkRef.current.getDeviceId()
        setDeviceId(id)
        localStorage.setItem("circle-deviceId", id)
      } catch (error) {
        console.error("Failed to get deviceId:", error)
      }
    }

    if (sdkReady) {
      void fetchDeviceId()
    }
  }, [sdkReady])

  const handleCreateDeviceToken = async () => {
    if (!deviceId) return
    setLoading(true)

    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createDeviceToken", deviceId }),
      })
      const data = await res.json()

      setDeviceToken(data.deviceToken)
      setDeviceEncryptionKey(data.deviceEncryptionKey)

      localStorage.setItem("circle-deviceToken", data.deviceToken)
      localStorage.setItem("circle-deviceEncryptionKey", data.deviceEncryptionKey)

      setStatus("Device token created. Click 'Login with Google' to continue.")
    } catch (error) {
      setStatus("Failed to create device token")
    } finally {
      setLoading(false)
    }
  }

  const handleLoginWithGoogle = () => {
    const sdk = sdkRef.current
    if (!sdk || !deviceToken || !deviceEncryptionKey) return

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
    console.log("Google Client ID:", googleClientId ? "SET" : "MISSING")
    console.log("App ID:", appId ? "SET" : "MISSING")

    sdk.updateConfigs({
      appSettings: { appId },
      loginConfigs: {
        deviceToken,
        deviceEncryptionKey,
        google: {
          clientId: googleClientId,
          redirectUri: window.location.origin,
          selectAccountPrompt: true,
        },
      },
    })

    setStatus("Redirecting to Google...")
    sdk.performLogin("Google")
  }

  const handleInitializeUser = async () => {
    if (!loginResult?.userToken) return
    setLoading(true)

    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "initializeUser",
          userToken: loginResult.userToken,
        }),
      })
      const data = await res.json()

      if (data.code === 155106) {
        // User already initialized, load wallets
        await loadWallets(loginResult.userToken)
        return
      }

      setChallengeId(data.challengeId)
      setStatus(`User initialized. Click 'Create Wallet' to continue.`)
    } catch (error) {
      setStatus("Failed to initialize user")
    } finally {
      setLoading(false)
    }
  }

  const handleExecuteChallenge = () => {
    const sdk = sdkRef.current
    if (!sdk || !challengeId || !loginResult) return

    sdk.setAuthentication({
      userToken: loginResult.userToken,
      encryptionKey: loginResult.encryptionKey,
    })

    setStatus("Creating wallet...")

    sdk.execute(challengeId, async (error: unknown) => {
      if (error) {
        setStatus("Failed to create wallet")
        return
      }

      setStatus("Wallet created! Loading details...")
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await loadWallets(loginResult.userToken)
    })
  }

  const loadWallets = async (userToken: string) => {
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "listWallets", userToken }),
      })
      const data = await res.json()

      const walletList = data.wallets || []
      setWallets(walletList)

      if (walletList.length > 0) {
        // Store wallet info and redirect to dashboard
        localStorage.setItem("circle-userToken", userToken)
        localStorage.setItem("circle-wallet-id", walletList[0].id)
        localStorage.setItem("circle-wallet-address", walletList[0].address)
        localStorage.setItem("adroit-user-id", userToken)

        setStatus("Wallet ready! Redirecting to dashboard...")
        setTimeout(() => router.push("/dashboard"), 1500)
      }
    } catch (error) {
      setStatus("Failed to load wallets")
    }
  }

  const primaryWallet = wallets[0]

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
            <CardTitle className="text-center">Sign In with Social Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div className="p-3 rounded-lg bg-muted text-sm">
              <strong>Status:</strong> {status}
            </div>

            {/* Step 1: Create Device Token */}
            <Button
              className="w-full"
              onClick={handleCreateDeviceToken}
              disabled={!sdkReady || !deviceId || loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              1. Create Device Token
            </Button>

            {/* Step 2: Login with Google */}
            <Button
              className="w-full"
              variant="outline"
              onClick={handleLoginWithGoogle}
              disabled={!deviceToken || !deviceEncryptionKey}
            >
              <Globe className="mr-2 h-4 w-5" />
              2. Login with Google
            </Button>

            {/* Step 3: Initialize User */}
            <Button
              className="w-full"
              variant="outline"
              onClick={handleInitializeUser}
              disabled={!loginResult || loading}
            >
              3. Initialize User
            </Button>

            {/* Step 4: Create Wallet */}
            <Button
              className="w-full"
              onClick={handleExecuteChallenge}
              disabled={!challengeId || wallets.length > 0}
            >
              4. Create Wallet
            </Button>

            {/* Wallet Details */}
            {primaryWallet && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm font-medium text-green-400 mb-2">Wallet Created!</p>
                <p className="text-xs text-muted-foreground">
                  <strong>Address:</strong> {primaryWallet.address}
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Blockchain:</strong> {primaryWallet.blockchain}
                </p>
              </div>
            )}

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground mt-4">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
