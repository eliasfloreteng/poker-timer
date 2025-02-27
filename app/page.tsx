import { PokerTimer } from "@/components/poker-timer"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Poker Tournament Timer</h1>
        <PokerTimer />
      </div>
    </main>
  )
}

