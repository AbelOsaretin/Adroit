"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Wallet,
  Send,
  History,
  RefreshCw,
  ExternalLink,
  Copy,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const appId = process.env.NEXT_PUBLIC_CIRCLE_APP_ID || ""

interface WalletData {
  walletId: string
  address: string
  blockchain: string
  balances: Array<{
    symbol: string
    amount: string
    tokenAddress?: string
  }>
}

interface Transaction {
  id: string
  type: "send" | "receive"
  to: string
  from: string
  amount: string
  status: string
  date: string
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sendAddress, setSendAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedWalletId, setCopiedWalletId] = useState(false)
  const sdkRef = useRef<any>(null)

  // Initialize SDK
  useEffect(() => {
    const initSdk = async () => {
      try {
        const { W3SSdk } = await import("@circle-fin/w3s-pw-web-sdk")
        const sdk = new W3SSdk({ appSettings: { appId } })
        sdkRef.current = sdk
      } catch (err) {
        console.error("Failed to initialize SDK:", err)
      }
    }
    initSdk()
  }, [])

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    setLoading(true)
    try {
      const walletId = localStorage.getItem("circle-wallet-id")
      const walletAddress = localStorage.getItem("circle-wallet-address")
      const userToken = localStorage.getItem("circle-userToken")

      if (!walletId || !walletAddress) {
        setWallet(null)
        setLoading(false)
        return
      }

      const balanceRes = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getTokenBalance",
          userToken,
          walletId,
        }),
      })
      const balanceData = await balanceRes.json()

      // Normalize token data - handle both real API and mock formats
      const balances = (balanceData.tokenBalances || []).map((b: any) => ({
        symbol: b.token?.symbol || b.symbol || "UNKNOWN",
        name: b.token?.name || b.name || "Unknown Token",
        amount: b.amount || "0",
        tokenAddress: b.token?.tokenAddress || b.tokenAddress || "",
        decimals: b.token?.decimals || 6,
      }))

      setWallet({
        walletId,
        address: walletAddress,
        blockchain: "ARC-TESTNET",
        balances,
      })

      // Create initial transaction based on actual balance
      const usdcAmount = balances.find((b: any) => b.symbol === "USDC")?.amount || "0"
      setTransactions([
        {
          id: "tx-1",
          type: "receive",
          to: walletAddress,
          from: "0x0000000000000000000000000000000000000000",
          amount: usdcAmount,
          status: "COMPLETE",
          date: "Funded via Faucet",
        },
      ])
    } catch (error) {
      console.error("Failed to load wallet:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadWalletData()
    setRefreshing(false)
  }

  const handleSendPayment = async () => {
    if (!sendAddress || !sendAmount || !wallet) return
    
    const sdk = sdkRef.current
    const userToken = localStorage.getItem("circle-userToken")
    const encryptionKey = localStorage.getItem("circle-encryptionKey")
    
    if (!sdk || !userToken || !encryptionKey) {
      console.error("SDK or credentials not available")
      return
    }
    
    setLoading(true)
    try {
      // Step 1: Create transaction challenge via API
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createTransactionChallenge",
          userToken,
          walletId: wallet.walletId,
          toAddress: sendAddress,
          amount: parseFloat(sendAmount),
        }),
      })
      
      const data = await res.json()
      
      if (!res.ok || !data.challengeId) {
        console.error("Failed to create challenge:", data)
        setLoading(false)
        return
      }
      
      // Step 2: Set authentication on SDK
      sdk.setAuthentication({
        userToken,
        encryptionKey,
      })
      
      // Step 3: Execute the challenge to sign the transaction
      sdk.execute(data.challengeId, (error: unknown) => {
        if (error) {
          console.error("Failed to sign transaction:", error)
          setTransactions([
            {
              id: data.challengeId,
              type: "send",
              to: sendAddress,
              from: wallet.address,
              amount: sendAmount,
              status: "FAILED",
              date: "Just now - Signing failed",
            },
            ...transactions,
          ])
        } else {
          setTransactions([
            {
              id: data.challengeId,
              type: "send",
              to: sendAddress,
              from: wallet.address,
              amount: sendAmount,
              status: "COMPLETE",
              date: "Just now",
            },
            ...transactions,
          ])
        }
        setSendAddress("")
        setSendAmount("")
        setLoading(false)
      })
    } catch (error) {
      console.error("Failed to send payment:", error)
      setLoading(false)
    }
  }

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  const copyWalletId = () => {
    if (wallet?.walletId) {
      navigator.clipboard.writeText(wallet.walletId)
      setCopiedWalletId(true)
      setTimeout(() => setCopiedWalletId(false), 2000)
    }
  }

  const usdcBalance = wallet?.balances?.find(
    (b) => b.symbol === "USDC" || b.symbol?.startsWith("USDC")
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your USDC wallet on Arc blockchain
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing || loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !wallet ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No wallet connected</p>
              <p className="text-sm text-muted-foreground">
                Your wallet was created during login. If you don't see it, please{" "}
                <a href="/login" className="text-primary hover:underline">
                  log in again
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Wallet Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">USDC Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${usdcBalance?.amount || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">on {wallet.blockchain}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-mono flex-1 p-2 rounded bg-muted truncate">
                      {wallet.address}
                    </div>
                    <Button variant="outline" size="sm" onClick={copyAddress}>
                      {copiedAddress ? (
                        <span className="text-green-500 text-xs">Copied!</span>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Wallet ID</p>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-mono flex-1 p-2 rounded bg-muted truncate">
                      {wallet.walletId}
                    </div>
                    <Button variant="outline" size="sm" onClick={copyWalletId}>
                      {copiedWalletId ? (
                        <span className="text-green-500 text-xs">Copied!</span>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wallet.blockchain}</div>
                <p className="text-xs text-muted-foreground">Arc Testnet</p>
                <a
                  href={`https://testnet.arcscan.app/address/${wallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-2 inline-flex items-center"
                >
                  View on Explorer <ArrowUpRight className="h-3 w-3 ml-1" />
                </a>
              </CardContent>
            </Card>
          </div>

          {/* All Token Balances */}
          {wallet.balances.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Token Balances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {wallet.balances.map((balance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          balance.symbol === "USDC" ? "bg-blue-600" :
                          balance.symbol === "ETH" ? "bg-gray-700" :
                          "bg-primary/20"
                        }`}>
                          {balance.symbol === "USDC" ? "$" :
                           balance.symbol === "ETH" ? "Ξ" :
                           balance.symbol?.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{balance.name || balance.symbol}</p>
                          <p className="text-xs text-muted-foreground">{balance.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{balance.amount}</p>
                        <p className="text-xs text-muted-foreground">{balance.symbol}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Send Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Send Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address">Recipient Address</Label>
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={sendAddress}
                    onChange={(e) => setSendAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USDC)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="mt-4"
                onClick={handleSendPayment}
                disabled={!sendAddress || !sendAmount}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Payment
              </Button>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No transactions yet</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === "receive" ? "bg-green-500/10" : "bg-blue-500/10"
                        }`}>
                          {tx.type === "receive" ? (
                            <ArrowDownRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {tx.type === "receive" ? "Received" : "Sent"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tx.type === "receive" ? `From: ${tx.from.slice(0, 10)}...` : `To: ${tx.to.slice(0, 10)}...`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${tx.type === "receive" ? "text-green-500" : "text-blue-500"}`}>
                          {tx.type === "receive" ? "+" : "-"}{tx.amount} USDC
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
