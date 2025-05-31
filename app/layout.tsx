import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pdro P - Runner App',
  description: 'Runner Dashboard',
  generator: 'Pdo P Dev Lawyer',
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
