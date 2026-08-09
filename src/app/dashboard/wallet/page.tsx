"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  ArrowRight,
  Globe,
  Zap,
  Plus,
  CheckCircle,
  DollarSign,
} from "lucide-react"

const appId = process.env.NEXT_PUBLIC_CIRCLE_APP_ID || ""

interface WalletData {
  walletId: string
  address: string
  blockchain: string
  balances: Array<{
    symbol: string
    name: string
    amount: string
    tokenAddress?: string
  }>
}

interface Transaction {
  id: string
  type: "send" | "receive" | "crosschain"
  to: string
  from: string
  amount: string
  status: string
  date: string
  sourceChain?: string
  destChain?: string
}

interface ChainBalance {
  chain: string
  balance: string
  domainId: number
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

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "send" | "fund">("overview")
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sendAddress, setSendAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedWalletId, setCopiedWalletId] = useState(false)
  const sdkRef = useRef<any>(null)

  // Gateway state
  const [chainBalances, setChainBalances] = useState<ChainBalance[]>([])
  const [sourceChain, setSourceChain] = useState("ETH_SEPOLIA")
  const [destChain, setDestChain] = useState("BASE_SEPOLIA")
  const [fundAmount, setFundAmount] = useState("")
  const [fundRecipient, setFundRecipient] = useState("")
  const [funding, setFunding] = useState(false)

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

      // Set chain balances (mock for now)
      setChainBalances([
        { chain: "ETH_SEPOLIA", balance: "0.00", domainId: 0 },
        { chain: "BASE_SEPOLIA", balance: "0.00", domainId: 6 },
        { chain: "ARC_TESTNET", balance: balances.find((b: any) => b.symbol === "USDC")?.amount || "0", domainId: 26 },
      ])

      // Set initial transaction
      const usdcAmount = balances.find((b: any) => b.symbol === "USDC")?.amount || "0"
      if (parseFloat(usdcAmount) > 0) {
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
      }
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
      
      sdk.setAuthentication({ userToken, encryptionKey })
      
      sdk.execute(data.challengeId, (error: unknown) => {
        if (error) {
          console.error("Failed to sign transaction:", error)
          setTransactions([
            {
              id: data.challengeId,
              type: "send",
              to: sendAddress,
              from: wallet!.address,
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
              from: wallet!.address,
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

  const handleFundWallet = async () => {
    if (!fundAmount || !fundRecipient) return
    setFunding(true)
    // Simulate crosschain transfer
    await new Promise(resolve => setTimeout(resolve, 1500))
    setTransactions([
      {
        id: `gw-${Date.now()}`,
        type: "crosschain",
        to: fundRecipient,
        from: sourceChain,
        amount: fundAmount,
        status: "INITIATED",
        date: "Just now",
        sourceChain,
        destChain,
      },
      ...transactions,
    ])
    setFundAmount("")
    setFundRecipient("")
    setFunding(false)
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
            Manage your funds and payments on Arc blockchain
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing || loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === "overview" ? "default" : "ghost"}
          onClick={() => setActiveTab("overview")}
        >
          <Wallet className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeTab === "send" ? "default" : "ghost"}
          onClick={() => setActiveTab("send")}
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
        <Button
          variant={activeTab === "fund" ? "default" : "ghost"}
          onClick={() => setActiveTab("fund")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Funds
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
                Your wallet was created during login.{" "}
                <a href="/login" className="text-primary hover:underline">
                  Log in again
                </a>{" "}
                to connect.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Balance Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">USDC Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${usdcBalance?.amount || "0.00"}</div>
                    <p className="text-xs text-muted-foreground">on {wallet.blockchain}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Address</p>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-mono flex-1 p-2 rounded bg-muted truncate">
                          {wallet.address}
                        </div>
                        <Button variant="outline" size="sm" onClick={copyAddress}>
                          {copiedAddress ? <span className="text-green-500 text-xs">Copied!</span> : <Copy className="h-4 w-4" />}
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
                          {copiedWalletId ? <span className="text-green-500 text-xs">Copied!</span> : <Copy className="h-4 w-4" />}
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

              {/* Token Balances */}
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
                              balance.symbol === "USDC" ? "bg-blue-600" : balance.symbol === "ETH" ? "bg-gray-700" : "bg-primary/20"
                            }`}>
                              {balance.symbol === "USDC" ? "$" : balance.symbol === "ETH" ? "Ξ" : balance.symbol?.slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{balance.name || balance.symbol}</p>
                              <p className="text-xs text-muted-foreground">{balance.symbol}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{balance.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Activity */}
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
                              tx.type === "receive" ? "bg-green-500/10" : tx.type === "crosschain" ? "bg-purple-500/10" : "bg-blue-500/10"
                            }`}>
                              {tx.type === "receive" ? (
                                <ArrowDownRight className="h-4 w-4 text-green-500" />
                              ) : tx.type === "crosschain" ? (
                                <Globe className="h-4 w-4 text-purple-500" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {tx.type === "receive" ? "Received" : tx.type === "crosschain" ? "Crosschain" : "Sent"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {tx.type === "crosschain" ? `${tx.sourceChain} → ${tx.destChain}` : tx.to.slice(0, 15) + "..."}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${
                              tx.type === "receive" ? "text-green-500" : tx.type === "crosschain" ? "text-purple-500" : "text-blue-500"
                            }`}>
                              {tx.type === "receive" ? "+" : ""}{tx.amount} USDC
                            </p>
                            <p className="text-xs text-muted-foreground">{tx.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Send Tab */}
          {activeTab === "send" && (
            <Card>
              <CardHeader>
                <CardTitle>Send Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sendAddress">Recipient Address</Label>
                    <Input
                      id="sendAddress"
                      placeholder="0x..."
                      value={sendAddress}
                      onChange={(e) => setSendAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sendAmount">Amount (USDC)</Label>
                    <Input
                      id="sendAmount"
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
          )}

          {/* Add Funds Tab */}
          {activeTab === "fund" && (
            <div className="space-y-6">
              {/* Chain Balances */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Chain Balances
                  </CardTitle>
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
                  <p className="text-sm text-muted-foreground mb-4">
                    Transfer USDC between chains instantly via Circle Gateway
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>From Chain</Label>
                      <Select value={sourceChain} onValueChange={(v) => setSourceChain(v || "ETH_SEPOLIA")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_CHAINS.map((chain) => (
                            <SelectItem key={chain.value} value={chain.value}>{chain.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>To Chain</Label>
                      <Select value={destChain} onValueChange={(v) => setDestChain(v || "BASE_SEPOLIA")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_CHAINS.map((chain) => (
                            <SelectItem key={chain.value} value={chain.value}>{chain.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fundAmount">Amount (USDC)</Label>
                      <Input
                        id="fundAmount"
                        type="number"
                        placeholder="0.00"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fundRecipient">Recipient Address</Label>
                      <Input
                        id="fundRecipient"
                        placeholder="0x..."
                        value={fundRecipient}
                        onChange={(e) => setFundRecipient(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    className="mt-4"
                    onClick={handleFundWallet}
                    disabled={funding || !fundAmount || !fundRecipient}
                  >
                    {funding ? "Processing..." : <><ArrowRight className="h-4 w-4 mr-2" /> Transfer Crosschain</>}
                  </Button>
                </CardContent>
              </Card>

              {/* Faucet Link */}
              <Card>
                <CardHeader>
                  <CardTitle>Get Test USDC</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get free testnet USDC from the Circle Faucet to test your wallet.
                  </p>
                  <a href="https://faucet.circle.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Open Faucet
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
