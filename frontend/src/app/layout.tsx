import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PageTransition } from '@/components/ui/page-transition'
import { AuthProvider } from '@/components/auth/auth-provider'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OnTrackr - Time Tracking & Scheduling',
  description: 'Modern time-tracking and scheduling web application for offices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



