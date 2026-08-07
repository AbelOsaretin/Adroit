"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CreditCard,
  Plus,
  Lock,
  Unlock,
  Copy,
  Eye,
  EyeOff,
  DollarSign,
  Link as LinkIcon,
  Check,
} from "lucide-react"

interface VirtualCard {
  id: string
  last4: string
  expiry: string
  cvv: string
  balance: number
  status: string
  linkedPlatform: string | null
  number?: string
}

export default function CardsPage() {
  const [cards, setCards] = useState<VirtualCard[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedCard, setSelectedCard] = useState<VirtualCard | null>(null)
  const [showCardNumber, setShowCardNumber] = useState(false)
  const [fundAmount, setFundAmount] = useState("")
  const [fundDialogCard, setFundDialogCard] = useState<VirtualCard | null>(null)

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cards?userId=default-user")
      const data = await res.json()
      if (data.success) {
        setCards(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error)
    } finally {
      setLoading(false)
    }
  }

  const createCard = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", userId: "default-user" }),
      })
      const data = await res.json()
      if (data.success) {
        setCards([...cards, data.data])
        setShowCreateDialog(false)
      }
    } catch (error) {
      console.error("Failed to create card:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCardDetails = async (card: VirtualCard) => {
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get-details",
          userId: "default-user",
          cardId: card.id,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSelectedCard(data.data)
        setShowCardNumber(false)
        setShowDetailsDialog(true)
      }
    } catch (error) {
      console.error("Failed to get card details:", error)
    }
  }

  const toggleCardLock = async (card: VirtualCard) => {
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "lock",
          userId: "default-user",
          cardId: card.id,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCards(cards.map((c) => (c.id === card.id ? data.data : c)))
      }
    } catch (error) {
      console.error("Failed to toggle card lock:", error)
    }
  }

  const fundCard = async () => {
    if (!fundDialogCard || !fundAmount) return

    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "fund",
          userId: "default-user",
          cardId: fundDialogCard.id,
          amount: parseFloat(fundAmount),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCards(cards.map((c) => (c.id === fundDialogCard.id ? data.data : c)))
        setFundDialogCard(null)
        setFundAmount("")
      }
    } catch (error) {
      console.error("Failed to fund card:", error)
    }
  }

  const copyCardNumber = () => {
    if (selectedCard?.number) {
      navigator.clipboard.writeText(selectedCard.number)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Virtual Cards</h1>
          <p className="text-muted-foreground">
            Create and manage cards for your ad spend
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Virtual Card</DialogTitle>
              <DialogDescription>
                Create a new virtual card for ad spend. You can fund it from your USDC
                wallet.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                This will create a new Visa virtual card that you can use to pay for
                Meta, Google, TikTok, and other ad platforms.
              </p>
              <p className="text-sm text-muted-foreground">
                After creation, you'll receive the card details (number, expiry, CVV)
                which you can manually add to your ad accounts.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createCard} disabled={loading}>
                {loading ? "Creating..." : "Create Card"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No virtual cards yet</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Card
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-bl-full" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-6 w-6" />
                    <span className="text-sm font-medium">Visa</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      card.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-2xl font-mono">•••• •••• •••• {card.last4}</p>
                  <p className="text-sm text-muted-foreground">Expires {card.expiry}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-lg font-bold">${card.balance.toFixed(2)}</p>
                  </div>
                  {card.linkedPlatform && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Linked to</p>
                      <p className="text-sm font-medium">{card.linkedPlatform}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => getCardDetails(card)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setFundDialogCard(card)}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Fund
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCardLock(card)}
                  >
                    {card.status === "active" ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Card Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Card Details</DialogTitle>
            <DialogDescription>
              Use these details to add the card to your ad platform
            </DialogDescription>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Card Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-lg">
                    {showCardNumber
                      ? selectedCard.number
                      : `•••• •••• •••• ${selectedCard.last4}`}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCardNumber(!showCardNumber)}
                  >
                    {showCardNumber ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={copyCardNumber}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                  <p className="font-mono">{selectedCard.expiry}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">CVV</p>
                  <p className="font-mono">{selectedCard.cvv}</p>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400 font-medium mb-1">
                  How to use this card
                </p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Copy the card number, expiry, and CVV</li>
                  <li>Go to Meta/Google/TikTok Ads</li>
                  <li>Add this card as a payment method</li>
                  <li>Create your campaign using this card</li>
                </ol>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fund Card Dialog */}
      <Dialog
        open={!!fundDialogCard}
        onOpenChange={() => setFundDialogCard(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Card</DialogTitle>
            <DialogDescription>
              Add funds from your USDC wallet to this card
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">
                ${fundDialogCard?.balance.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="50"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFundDialogCard(null)}>
              Cancel
            </Button>
            <Button
              onClick={fundCard}
              disabled={!fundAmount || parseFloat(fundAmount) <= 0}
            >
              Fund Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
