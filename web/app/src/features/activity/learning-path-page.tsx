import {
  MarketingPageShell,
  PAGE_CONTAINER_WIDE,
  PAGE_CONTENT_PY,
} from "@/components/layout/marketing-page-shell"
import { ActivityDashboard } from "@/features/activity/activity-dashboard"
import { LanguageHubToolbar } from "@/features/learn/language-hub-toolbar"
import { getMockActivityDashboard } from "@/lib/user-activity/mock/get-mock-activity-dashboard"
import type { LanguageHubCode } from "@/lib/learn/hub"

const TRAIL_LABEL = "Lộ trình học"

type LearningPathPageProps = {
  language: LanguageHubCode
}

export function LearningPathPage({ language }: LearningPathPageProps) {
  const data = getMockActivityDashboard()

  return (
    <MarketingPageShell>
      <LanguageHubToolbar language={language} trail={[{ label: TRAIL_LABEL }]} />
      <div className={PAGE_CONTAINER_WIDE}>
        <div className={PAGE_CONTENT_PY}>
          <ActivityDashboard data={data} />
        </div>
      </div>
    </MarketingPageShell>
  )
}
