"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Copy, ExternalLink, RefreshCw } from "lucide-react"

interface UserData {
  userId: string
  walletId?: string
  walletAddress?: string
  authMethod: string
}

interface WalletBalance {
  symbol: string
  amount: string
}

export function WalletConnect() {
  const [user, setUser] = useState<UserData | null>(null)
  const [balances, setBalances] = useState<WalletBalance[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for existing session
    const userId = localStorage.getItem("adroit-user-id")
    const authMethod = localStorage.getItem("adroit-auth-method")
    const walletId = localStorage.getItem("adroit-wallet-id")
    const walletAddress = localStorage.getItem("adroit-wallet-address")

    if (userId) {
      setUser({
        userId,
        walletId: walletId || undefined,
        walletAddress: walletAddress || undefined,
        authMethod: authMethod || "unknown",
      })
    }
  }, [])

  const handleCreateWallet = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-wallet",
          userId: user?.userId,
        }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem("adroit-wallet-id", data.data.walletId)
        localStorage.setItem("adroit-wallet-address", data.data.address)

        setUser(prev => prev ? {
          ...prev,
          walletId: data.data.walletId,
          walletAddress: data.data.address,
        } : null)
      }
    } catch (error) {
      console.error("Failed to create wallet:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshBalance = async () => {
    if (!user?.walletId) return
    setLoading(true)
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get-balance",
          walletId: user.walletId,
        }),
      })
      const data = await res.json()

      if (data.success) {
        setBalances(data.data.balances)
      }
    } catch (error) {
      console.error("Failed to get balance:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adroit-user-id")
    localStorage.removeItem("adroit-auth-method")
    localStorage.removeItem("adroit-wallet-id")
    localStorage.removeItem("adroit-wallet-address")
    window.location.href = "/login"
  }

  const copyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No wallet connected</p>
            <Button onClick={() => window.location.href = "/login"}>
              Sign In to Create Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="text-sm">
          <p className="text-muted-foreground">Signed in via</p>
          <p className="font-medium capitalize">{user.authMethod}</p>
        </div>

        {/* Wallet Address */}
        {user.walletAddress ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Wallet Address</p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                {user.walletAddress}
              </code>
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
              <a href={`https://sepolia.etherscan.io/address/${user.walletAddress}`} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <Button onClick={handleCreateWallet} disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Wallet"}
          </Button>
        )}

        {/* Balances */}
        {user.walletId && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Balances</p>
              <Button variant="ghost" size="sm" onClick={handleRefreshBalance} disabled={loading}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            {balances.length > 0 ? (
              <div className="space-y-1">
                {balances.map((balance) => (
                  <div key={balance.symbol} className="flex justify-between text-sm">
                    <span>{balance.symbol}</span>
                    <span className="font-medium">{balance.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Click refresh to load balances</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
