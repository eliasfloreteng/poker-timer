import { Metadata } from "next"
import { PageLayout } from "@/components/page-layout"
import { PokerTimerPage } from "@/components/poker-timer-page"

export const metadata: Metadata = {
  title: "Poker Timer - Tournament Timer",
  description:
    "Professional poker tournament timer with customizable blinds, levels, and break periods.",
}

export default function TimerPage() {
  return (
    <PageLayout>
      <PokerTimerPage />
    </PageLayout>
  )
}
