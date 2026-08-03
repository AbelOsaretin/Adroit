import Link from "next/link"

export function Footer() {
  return (
    <footer id="contact" className="relative pt-32 pb-12 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tighter mb-6 block">
              Adroit<span className="text-blue-400">.</span>
            </Link>
            <p className="text-white/50 leading-relaxed">
              Democratizing marketing for every small business with AI-powered campaigns and analytics.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Services</h4>
            <ul className="space-y-4 text-white/60">
              <li><Link href="#services" className="hover:text-white transition-colors">Marketing Strategy</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">Content Creation</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">SEO & Analytics</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">Campaign Optimization</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Platforms</h4>
            <ul className="space-y-4 text-white/60">
              <li><Link href="#platforms" className="hover:text-white transition-colors">Google Ads</Link></li>
              <li><Link href="#platforms" className="hover:text-white transition-colors">Meta Ads</Link></li>
              <li><Link href="#platforms" className="hover:text-white transition-colors">Amazon Ads</Link></li>
              <li><Link href="#platforms" className="hover:text-white transition-colors">TikTok Ads</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Get Started</h4>
            <p className="text-white/60 mb-4">Ready to grow your business?</p>
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-white/90 transition-colors">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-white/40">
          <p>&copy; 2026 Adroit. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
