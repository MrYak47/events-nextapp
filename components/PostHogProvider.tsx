'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
   useEffect(() => {
      // Guard: Check if PostHog is already initialized to prevent duplicate init
      if (typeof window !== 'undefined' && !posthog.__loaded) {
         posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
            person_profiles: 'identified_only',
            capture_pageview: false, // Disabled; handled manually by PostHogPageView
         })
      }
   }, [])

   return <PHProvider client={posthog}>{children}</PHProvider>
}
