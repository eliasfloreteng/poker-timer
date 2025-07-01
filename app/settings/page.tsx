import { Metadata } from "next"
import { PageLayout } from "@/components/page-layout"
import { SettingsPage } from "@/components/settings-page"

export const metadata: Metadata = {
  title: "Poker Timer - Settings",
  description:
    "Configure poker timer settings, sound preferences, and theme options.",
}

export default function Settings() {
  return (
    <PageLayout>
      <SettingsPage />
    </PageLayout>
  )
}
