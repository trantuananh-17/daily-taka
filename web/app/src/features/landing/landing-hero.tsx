import { BrandLockup } from "@/components/layout/brand-lockup"
import { APP_NAME } from "@/lib/brand"

export function LandingHero() {
  return (
    <section className="mx-auto flex w-full max-w-[720px] flex-col items-center px-4 text-center">
      <BrandLockup markSize="hero" variant="hero" className="justify-center" />
      <p className="dlx-lead mx-auto mt-8 text-center">
        Học tiếng Anh, tiếng Nhật và tiếng Trung cùng {APP_NAME}: luyện nghe chép chính tả, học từ vựng theo
        ngữ cảnh và luyện viết từng câu theo trình độ.
      </p>
    </section>
  )
}
