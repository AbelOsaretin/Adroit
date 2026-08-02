import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Adroit</h1>
          <nav className="flex gap-4">
            <Link href="/chat">
              <Button>Start Chat</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl text-center space-y-6">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your AI Marketing Agency
          </h2>
          <p className="text-lg text-muted-foreground">
            End-to-end marketing services for small businesses. 
            Autonomous AI-powered campaigns, content creation, SEO optimization, 
            and social media management — all at a fraction of traditional agency costs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">Learn More</Button>
            </Link>
          </div>
        </div>

        <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Marketing Strategy</h3>
            <p className="text-muted-foreground">
              Get a comprehensive marketing plan tailored to your business goals and budget.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Content Creation</h3>
            <p className="text-muted-foreground">
              Generate engaging content for social media, blogs, emails, and ads.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">SEO & Analytics</h3>
            <p className="text-muted-foreground">
              Optimize your online presence and track your marketing performance.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Adroit. Democratizing marketing for every small business.</p>
        </div>
      </footer>
    </div>
  )
}
