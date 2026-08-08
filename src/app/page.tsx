import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Platforms } from "@/components/platforms"
import { Footer } from "@/components/footer"
import { Zap, DollarSign, Globe, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <Services />
      <Platforms />

      {/* AI Agent Services Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-purple-900/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">For AI Agents</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Marketing Services<br />
              <span className="text-gradient">via API</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Access professional marketing services programmatically. 
              Pay per use with USDC on Arc blockchain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">x402 Payments</h3>
              <p className="text-sm text-white/60">
                Pay-per-call micropayments in USDC. No subscriptions, no minimums.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">USDC on Arc</h3>
              <p className="text-sm text-white/60">
                Instant settlements on Arc blockchain. Low fees, fast finality.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">10+ Services</h3>
              <p className="text-sm text-white/60">
                SEO, campaigns, content, strategy - all available via API.
              </p>
            </div>
          </div>

          <div className="text-center">
            <a href="/services">
              <button className="px-8 py-4 glass rounded-full font-semibold text-lg hover:bg-white/10 transition-all group">
                Explore Services
                <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Ready to grow <br />
            <span className="text-gradient">your business?</span>
          </h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            Let AI handle your marketing while you focus on what you do best.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/login">
              <button className="px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                Get Started
              </button>
            </a>
            <a href="/services">
              <button className="px-10 py-5 glass rounded-full font-bold text-xl hover:scale-105 transition-transform">
                View Services
              </button>
            </a>
          </div>
        </div>
        
        {/* Background Gradient for CTA */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
      </section>
      
      <Footer />
    </main>
  )
}
