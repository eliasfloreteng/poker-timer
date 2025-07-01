import { PokerTimer } from "@/components/poker-timer"

export default function Home() {
  return (
    <main className="min-h-screen p-2 md:p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Poker Timer & Debt Tracker
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Tournament timer with session debt tracking in Swedish Crowns (SEK)
        </p>
        <PokerTimer />
      </div>
    </main>
  )
}
