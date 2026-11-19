import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/lib/store'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://royalcrestfinancials.com'),
  title: 'RoyalCrest Bank — Secure Banking for Everyone',
  description:
    'RoyalCrest Bank offers secure, seamless digital banking. Open an account, transfer funds, manage deposits, and more.',
  keywords: 'bank, online banking, RoyalCrest, secure payments, digital banking, trust bank',
  icons: {
    icon: [
      { url: '/banklogo.png', type: 'image/png' },
    ],
    apple: '/banklogo.png',
  },
  openGraph: {
    title: 'RoyalCrest Bank — Secure Banking for Everyone',
    description:
      'RoyalCrest Bank offers secure, seamless digital banking. Open an account, transfer funds, manage deposits, and more.',
    url: 'https://royalcrestfinancials.com',
    siteName: 'RoyalCrest Bank',
    images: [
      {
        url: '/banklogo.png',
        width: 1200,
        height: 630,
        alt: 'RoyalCrest Bank',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoyalCrest Bank — Secure Banking for Everyone',
    description:
      'RoyalCrest Bank offers secure, seamless digital banking. Open an account, transfer funds, manage deposits, and more.',
    images: ['/banklogo.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#1b2a4a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="antialiased font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
