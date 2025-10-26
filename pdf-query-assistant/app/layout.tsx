import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF Query Assistant',
  description: 'AI-Powered Contextual PDF Query System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
