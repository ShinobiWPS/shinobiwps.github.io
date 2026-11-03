import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Draft landing page',
}

export default function DraftLandingPage() {
  const basePath = process.env.BASE_PATH || ''

  return (
    <iframe
      title="Draft landing page preview"
      src={`${basePath}/static/draft-landing-page.html`}
      className="fixed inset-0 z-[100] h-dvh w-screen border-0"
    />
  )
}
