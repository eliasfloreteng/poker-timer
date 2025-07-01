import { Metadata } from "next"
import { PageLayout } from "@/components/page-layout"
import { LevelsPage } from "@/components/levels-page"

export const metadata: Metadata = {
  title: "Poker Timer - Levels & Blinds",
  description:
    "Configure poker tournament blind levels, antes, breaks, and timing settings.",
}

export default function Levels() {
  return (
    <PageLayout>
      <LevelsPage />
    </PageLayout>
  )
}
