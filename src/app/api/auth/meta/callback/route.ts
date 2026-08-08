// Meta OAuth Callback Handler
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state") // userId
  const error = url.searchParams.get("error")

  if (error) {
    // OAuth failed - redirect to settings with error
    return NextResponse.redirect(
      new URL(`/dashboard/settings?error=${error}`, request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=no_code", request.url)
    )
  }

  try {
    // Exchange code for token via our API
    const response = await fetch(`${url.origin}/api/auth/meta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "callback",
        code,
        userId: state || "default-user",
      }),
    })

    const data = await response.json()

    if (data.success) {
      // Store connection status in localStorage
      const html = `
        <html>
          <body>
            <script>
              localStorage.setItem("meta-connected", "true");
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
