import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cilalawi.info'),
  title: {
    default: 'Website Resmi Desa Cilalawi',
    template: '%s | Desa Cilalawi',
  },
  description: 'Portal resmi informasi publik, layanan kependudukan warga, berita kegiatan, dan transparansi Pemerintah Desa Cilalawi, Sukatani, Purwakarta.',
  keywords: ['Desa Cilalawi', 'Cilalawi', 'Sukatani', 'Purwakarta', 'Website Desa', 'Layanan Desa', 'Portal Resmi Desa Cilalawi'],
  authors: [{ name: 'Pemerintah Desa Cilalawi' }],
  creator: 'Pemerintah Desa Cilalawi',
  publisher: 'Pemerintah Desa Cilalawi',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://cilalawi.info',
    siteName: 'Desa Cilalawi',
    title: 'Website Resmi Desa Cilalawi',
    description: 'Portal resmi informasi publik, layanan kependudukan warga, berita kegiatan, dan transparansi Pemerintah Desa Cilalawi.',
    images: [
      {
        url: '/pemandangan.jpeg',
        width: 1200,
        height: 630,
        alt: 'Pemandangan Desa Cilalawi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Resmi Desa Cilalawi',
    description: 'Portal resmi informasi publik, layanan kependudukan warga, berita kegiatan, dan transparansi Pemerintah Desa Cilalawi.',
    images: ['/pemandangan.jpeg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="id">
        <body className={`${inter.variable} ${geistMono.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
