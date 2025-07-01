import { Metadata } from "next"
import { PageLayout } from "@/components/page-layout"
import { ChipsPage } from "@/components/chips-page"

export const metadata: Metadata = {
  title: "Poker Timer - Chip Calculator",
  description:
    "Calculate chip denominations and distributions for poker tournaments.",
}

export default function Chips() {
  return (
    <PageLayout>
      <ChipsPage />
    </PageLayout>
  )
}
