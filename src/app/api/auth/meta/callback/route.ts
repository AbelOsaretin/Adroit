// Meta OAuth Callback Handler
import { NextRequest, NextResponse } from "next/server"
import { initDatabase } from "@/lib/db/schema"
import { saveIntegration } from "@/lib/db/users"

// Initialize database
let dbInitialized = false;
async function ensureDb() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

export async function GET(request: NextRequest) {
  await ensureDb();
  
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state") // Encoded wallet info
  const error = url.searchParams.get("error")

  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard/settings?error=${error}`, request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=no_code", request.url)
    )
  }

  // Decode wallet info from state
  let walletAddress = "default-user"
  let walletId = ""
  try {
    const stateData = JSON.parse(decodeURIComponent(state || "{}"))
    walletAddress = stateData.walletAddress || "default-user"
    walletId = stateData.walletId || ""
  } catch (e) {
    // Fallback to plain state
    walletAddress = state || "default-user"
  }

  try {
    const response = await fetch(`${url.origin}/api/auth/meta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "callback",
        code,
        walletAddress,
        walletId,
      }),
    })

    const data = await response.json()

    if (data.success) {
      // Save integration to database
      await saveIntegration(walletAddress, "meta", {
        access_token: data.accessToken || "",
        account_id: data.accountId || "",
        account_name: data.accountName || "",
      })

      // Store in localStorage for frontend
      const html = `
        <html>
          <body>
            <script>
              localStorage.setItem("meta-connected", "true");
              localStorage.setItem("meta-access-token", "${data.accessToken || ""}");
              localStorage.setItem("meta-account-id", "${data.accountId || ""}");
              localStorage.setItem("meta-account-name", "${data.accountName || ""}");
              window.location.href = "/dashboard/settings?connected=true";
            </script>
          </body>
        </html>
      `
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html" },
      })
    } else {
      return NextResponse.redirect(
        new URL(`/dashboard/settings?error=${data.error || "unknown"}`, request.url)
      )
    }
  } catch (error) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=callback_failed", request.url)
    )
  }
}
