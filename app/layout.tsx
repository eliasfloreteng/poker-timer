import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Poker Timer",
  description: "A poker timer with levels, blinds, and chip denominations.",
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
