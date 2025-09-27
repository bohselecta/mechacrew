import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
  title: 'MechaCrew - Collaborative AI Mecha Builder',
  description: 'Build epic mechas with AI and collaborate in real-time. The future of multiplayer creation.',
  keywords: 'mecha, AI, collaboration, 3D, builder, anime, cyberpunk',
  authors: [{ name: 'MechaCrew Team' }],
  openGraph: {
    title: 'MechaCrew - Collaborative AI Mecha Builder',
    description: 'Build epic mechas with AI and collaborate in real-time. The future of multiplayer creation.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MechaCrew - Collaborative AI Mecha Builder',
    description: 'Build epic mechas with AI and collaborate in real-time. The future of multiplayer creation.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="font-inter antialiased">
        <div className="min-h-screen blueprint-bg">
          {children}
        </div>
      </body>
    </html>
  )
}
