"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, Send, History, Plus, RefreshCw, ExternalLink } from "lucide-react"

interface WalletData {
  walletId: string
  address: string
  balance: string
  blockchain: string
}

interface Transaction {
  id: string
  to: string
  amount: string
  status: string
  date: string
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(false)
  const [sendAddress, setSendAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Mock wallet data
  useEffect(() => {
    setWallet({
      walletId: "wallet-123",
      address: "0x1234567890abcdef1234567890abcdef12345678",
      balance: "1,250.50",
      blockchain: "ARC-TESTNET",
    })
    setTransactions([
      { id: "tx-1", to: "0xabcd...ef01", amount: "100", status: "COMPLETE", date: "2 hours ago" },
      { id: "tx-2", to: "0x9876...5432", amount: "50", status: "COMPLETE", date: "1 day ago" },
      { id: "tx-3", to: "0xdead...beef", amount: "200", status: "PENDING", date: "2 days ago" },
    ])
  }, [])

  const handleCreateWallet = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setWallet({
      walletId: `wallet-${Date.now()}`,
      address: `0x${Date.now().toString(16).padStart(40, "0")}`,
      balance: "0",
      blockchain: "ARC-TESTNET",
    })
    setLoading(false)
  }

  const handleSendPayment = async () => {
    if (!sendAddress || !sendAmount) return
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setTransactions([
      { id: `tx-${Date.now()}`, to: sendAddress, amount: sendAmount, status: "INITIATED", date: "Just now" },
      ...transactions,
    ])
    setSendAddress("")
    setSendAmount("")
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your USDC wallet on Arc blockchain
        </p>
      </div>

      {/* Wallet Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">USDC Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet?.balance || "0"}</div>
            <p className="text-xs text-muted-foreground">
              on {wallet?.blockchain || "ARC-TESTNET"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono truncate">{wallet?.address || "Not connected"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {wallet?.walletId || "No wallet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button size="sm" onClick={handleCreateWallet} disabled={loading}>
              <Plus className="h-4 w-4 mr-1" />
              Create Wallet
            </Button>
            <Button size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>

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
            disabled={loading || !sendAddress || !sendAmount}
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Sending..." : "Send Payment"}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="text-sm font-medium">To: {tx.to}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{tx.amount} USDC</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tx.status === "COMPLETE" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
