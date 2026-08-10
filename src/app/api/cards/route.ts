// Virtual Cards API
// Manages virtual cards for ad spend

import { NextRequest, NextResponse } from "next/server"

// In production, this would use Marqeta or similar card issuer
const cardsStore = new Map<string, any[]>()

// GET /api/cards - List user's virtual cards
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const userId = url.searchParams.get("userId") || "default-user"
  const cardId = url.searchParams.get("cardId")

  const cards = cardsStore.get(userId) || []

  if (cardId) {
    const card = cards.find((c) => c.id === cardId)
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: card })
  }

  return NextResponse.json({ success: true, data: cards })
}

// POST /api/cards - Create new virtual card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId = "default-user", cardId, amount, cardDetails } = body

    const cards = cardsStore.get(userId) || []

    switch (action) {
      case "create": {
        // Create new virtual card
        const newCard = {
          id: `card-${Date.now()}`,
          last4: Math.floor(1000 + Math.random() * 9000).toString(),
          expiry: `${String(Math.floor(1 + Math.random() * 12)).padStart(2, "0")}/28`,
          cvv: Math.floor(100 + Math.random() * 900).toString(),
          balance: 0,
          status: "active",
          linkedPlatform: null,
          createdAt: new Date().toISOString(),
        }

        cards.push(newCard)
        cardsStore.set(userId, cards)

        return NextResponse.json({
          success: true,
          data: newCard,
        })
      }

      case "fund": {
        // Fund card from USDC balance
        const card = cards.find((c) => c.id === cardId)
        if (!card) {
          return NextResponse.json({ error: "Card not found" }, { status: 404 })
        }

        card.balance += amount || 0
        return NextResponse.json({
          success: true,
          data: card,
        })
      }

      case "get-details": {
        // Get full card details (for display)
        const card = cards.find((c) => c.id === cardId)
        if (!card) {
          return NextResponse.json({ error: "Card not found" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          data: {
            ...card,
            number: `411111111111${card.last4}`,
          },
        })
      }

      case "lock": {
        // Lock/unlock card
        const card = cards.find((c) => c.id === cardId)
        if (!card) {
          return NextResponse.json({ error: "Card not found" }, { status: 404 })
        }

        card.status = card.status === "active" ? "locked" : "active"
        return NextResponse.json({
          success: true,
          data: card,
        })
      }

      case "link-platform": {
        // Link card to ad platform
        const card = cards.find((c) => c.id === cardId)
        if (!card) {
          return NextResponse.json({ error: "Card not found" }, { status: 404 })
        }

        card.linkedPlatform = cardDetails?.platform || null
        return NextResponse.json({
          success: true,
          data: card,
        })
      }

      case "list": {
        // List all cards for user
        return NextResponse.json({
          success: true,
          data: {
            cards: cards,
          },
        })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
