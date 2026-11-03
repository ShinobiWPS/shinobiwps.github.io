import bundleAnalyzer from '@next/bundle-analyzer'
import { withContentlayer } from 'next-contentlayer2'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is simpleanalytics.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src giscus.app
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const contentSecurityPolicy = securityHeaders.find(
  (header) => header.key === 'Content-Security-Policy'
).value

const headersWithOverrides = (overrides) =>
  securityHeaders.map(({ key, value }) => ({
    key,
    value: overrides[key] ?? value,
  }))

const draftLandingPageHeaders = headersWithOverrides({
  'Content-Security-Policy': contentSecurityPolicy.replace(
    'frame-src giscus.app',
    "frame-src 'self' giscus.app"
  ),
})

// This standalone document is embedded by its route; keep framing same-origin only.
const draftLandingDocumentHeaders = headersWithOverrides({
  'Content-Security-Policy': contentSecurityPolicy
    .replace(
      "style-src 'self' 'unsafe-inline';",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
    )
    .replace("font-src 'self';", "font-src 'self' https://fonts.gstatic.com;")
    .replace('media-src *.s3.amazonaws.com;', 'media-src *.s3.amazonaws.com data:;')
    .trimEnd()
    .concat("; frame-ancestors 'self'"),
  'X-Frame-Options': 'SAMEORIGIN',
})

const output = process.env.EXPORT ? 'export' : undefined
const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

const config = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    output,
    basePath,
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['app', 'components', 'layouts', 'scripts'],
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
      unoptimized,
    },
    async headers() {
      return [
        // Keep DENY globally; only this route embeds the standalone document.
        {
          source: '/((?!draft-landing-page$|static/draft-landing-page\\.html$).*)',
          headers: securityHeaders,
        },
        {
          source: '/draft-landing-page',
          headers: draftLandingPageHeaders,
        },
        {
          source: '/static/draft-landing-page.html',
          headers: draftLandingDocumentHeaders,
        },
      ]
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  })
}

export default config
