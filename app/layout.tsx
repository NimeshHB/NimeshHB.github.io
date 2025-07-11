import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'group 09',
  description: 'Created group 09',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
