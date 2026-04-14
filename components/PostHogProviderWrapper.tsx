'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const PostHogProvider = dynamic(
   () => import('./PostHogProvider').then(mod => ({ default: mod.PostHogProvider })),
   { ssr: false }
);

export function PostHogProviderWrapper({ children }: { children: ReactNode }) {
   return <PostHogProvider>{children}</PostHogProvider>;
}
