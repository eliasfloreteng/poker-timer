import { Metadata } from "next"
import { PageLayout } from "@/components/page-layout"
import { PlayersPage } from "@/components/players-page"

export const metadata: Metadata = {
  title: "Poker Timer - Players & Seating",
  description:
    "Manage poker tournament players, seating arrangements, and table positions.",
}

export default function Players() {
  return (
    <PageLayout>
      <PlayersPage />
    </PageLayout>
  )
}
