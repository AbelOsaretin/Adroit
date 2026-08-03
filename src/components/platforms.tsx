"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { motion } from "framer-motion"
import { 
  Search, 
  Share2, 
  ShoppingCart, 
  Briefcase, 
  Monitor, 
  Image, 
  Camera, 
  Music 
} from 'lucide-react'

const platforms = [
  {
    icon: <Search className="w-6 h-6 text-blue-400" />,
    name: "Google Ads",
    description: "Search, Display, YouTube, and Shopping campaigns",
  },
  {
    icon: <Share2 className="w-6 h-6 text-blue-500" />,
    name: "Meta Ads",
    description: "Facebook, Instagram, and Messenger advertising",
  },
  {
    icon: <ShoppingCart className="w-6 h-6 text-orange-400" />,
    name: "Amazon Ads",
    description: "Sponsored Products, Brands, and Display ads",
  },
  {
    icon: <Briefcase className="w-6 h-6 text-blue-600" />,
    name: "LinkedIn Ads",
    description: "B2B targeting and professional audience reach",
  },
  {
    icon: <Monitor className="w-6 h-6 text-blue-700" />,
    name: "Microsoft Ads",
    description: "Bing search and Microsoft Audience Network",
  },
  {
    icon: <Image className="w-6 h-6 text-red-500" />,
    name: "Pinterest Ads",
    description: "Visual discovery and shopping campaigns",
  },
  {
    icon: <Camera className="w-6 h-6 text-yellow-400" />,
    name: "Snapchat Ads",
    description: "Snap Ads, Stories, and AR experiences",
  },
  {
    icon: <Music className="w-6 h-6 text-pink-500" />,
    name: "TikTok Ads",
    description: "In-feed, Spark Ads, and branded effects",
  },
]

export function Platforms() {
  return (
    <section id="platforms" className="py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Ad Platforms
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Manage all your advertising from one place. Our AI integrates with 8 major ad platforms.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "100px" }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-6"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="h-full text-center group cursor-default">
                <div className="mb-4 p-3 rounded-xl bg-white/5 w-fit mx-auto group-hover:bg-white/10 transition-colors">
                  {platform.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{platform.name}</h3>
                <p className="text-sm text-white/50">{platform.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
