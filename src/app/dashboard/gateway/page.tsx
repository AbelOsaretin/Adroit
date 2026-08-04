"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, ArrowRight, RefreshCw, Zap, CheckCircle } from "lucide-react"

interface ChainBalance {
  chain: string
  balance: string
  domainId: number
}

interface Transfer {
  id: string
  sourceChain: string
  destinationChain: string
  amount: string
  status: string
  date: string
}

const SUPPORTED_CHAINS = [
  { value: "ETH_SEPOLIA", label: "Ethereum Sepolia", domainId: 0 },
  { value: "AVAX_FUJI", label: "Avalanche Fuji", domainId: 1 },
  { value: "OP_SEPOLIA", label: "OP Sepolia", domainId: 2 },
  { value: "ARB_SEPOLIA", label: "Arbitrum Sepolia", domainId: 3 },
  { value: "BASE_SEPOLIA", label: "Base Sepolia", domainId: 6 },
  { value: "MATIC_AMOY", label: "Polygon Amoy", domainId: 7 },
  { value: "ARC_TESTNET", label: "Arc Testnet", domainId: 26 },
]

export default function GatewayPage() {
  const [unifiedBalance, setUnifiedBalance] = useState("0")
  const [chainBalances, setChainBalances] = useState<ChainBalance[]>([])
  const [loading, setLoading] = useState(false)
  const [sourceChain, setSourceChain] = useState("ETH_SEPOLIA")
  const [destChain, setDestChain] = useState("BASE_SEPOLIA")
  const [transferAmount, setTransferAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [transfers, setTransfers] = useState<Transfer[]>([])

  // Mock data
  useEffect(() => {
    setUnifiedBalance("5,250.75")
    setChainBalances([
      { chain: "ETH_SEPOLIA", balance: "1,250.50", domainId: 0 },
      { chain: "BASE_SEPOLIA", balance: "2,000.25", domainId: 6 },
      { chain: "ARC_TESTNET", balance: "2,000.00", domainId: 26 },
    ])
    setTransfers([
      { id: "gw-1", sourceChain: "ETH_SEPOLIA", destinationChain: "BASE_SEPOLIA", amount: "100", status: "COMPLETE", date: "2 hours ago" },
      { id: "gw-2", sourceChain: "ARC_TESTNET", destinationChain: "ETH_SEPOLIA", amount: "50", status: "COMPLETE", date: "1 day ago" },
    ])
  }, [])

  const handleTransfer = async () => {
    if (!transferAmount || !recipient) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setTransfers([
      {
        id: `gw-${Date.now()}`,
        sourceChain,
        destinationChain: destChain,
        amount: transferAmount,
        status: "INITIATED",
        date: "Just now",
      },
      ...transfers,
    ])
    setTransferAmount("")
    setRecipient("")
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gateway</h1>
        <p className="text-muted-foreground">
          Unified USDC balance across multiple chains with instant transfers
        </p>
      </div>

      {/* Unified Balance */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Unified Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">${unifiedBalance}</div>
          <p className="text-muted-foreground mt-2">
            Total USDC across all chains
          </p>
          <Button className="mt-4" variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Balance
          </Button>
        </CardContent>
      </Card>

      {/* Chain Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Chain Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chainBalances.map((item) => (
              <div key={item.chain} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.chain}</span>
                  <span className="text-xs text-muted-foreground">Domain {item.domainId}</span>
                </div>
                <div className="text-2xl font-bold mt-2">${item.balance}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crosschain Transfer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Crosschain Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Source Chain</Label>
              <Select value={sourceChain} onValueChange={(v) => setSourceChain(v || "ETH_SEPOLIA")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source chain" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain.value} value={chain.value}>
                      {chain.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destination Chain</Label>
              <Select value={destChain} onValueChange={(v) => setDestChain(v || "BASE_SEPOLIA")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination chain" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain.value} value={chain.value}>
                      {chain.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USDC)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="mt-4"
            onClick={handleTransfer}
            disabled={loading || !transferAmount || !recipient}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Transfer Crosschain
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Transfer History */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transfers.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="text-sm font-medium">
                    {tx.sourceChain} → {tx.destinationChain}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{tx.amount} USDC</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tx.status === "COMPLETE" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}>
                    {tx.status === "COMPLETE" && <CheckCircle className="h-3 w-3 inline mr-1" />}
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
