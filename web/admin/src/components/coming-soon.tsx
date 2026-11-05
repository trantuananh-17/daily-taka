type ComingSoonProps = {
  title?: string
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="font-heading text-lg font-semibold text-foreground">
        {title ? `${title} — ` : ""}Coming soon
      </p>
      <p className="max-w-md text-sm text-muted-foreground">
        Trang CMS sẽ được nối API admin ở bước tiếp theo.
      </p>
    </div>
  )
}
