import { Navigation } from "@/components/navigation"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="min-h-screen p-2 md:p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Poker Timer & Session Tracker
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Tournament timer with session profit/loss tracking in Swedish Crowns
          (SEK)
        </p>

        <Navigation />

        {children}
      </div>
    </main>
  )
}
