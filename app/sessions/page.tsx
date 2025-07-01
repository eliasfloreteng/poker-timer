import { Metadata } from "next"
import { PageLayout } from "@/components/page-layout"
import { SessionsPage } from "@/components/sessions-page"

export const metadata: Metadata = {
  title: "Poker Timer - Session Tracker",
  description:
    "Track poker session profits and losses with player statistics in Swedish Crowns (SEK).",
}

export default function Sessions() {
  return (
    <PageLayout>
      <SessionsPage />
    </PageLayout>
  )
}
