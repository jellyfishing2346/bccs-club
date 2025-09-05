export const dynamic = 'error';
export const dynamicParams = false;
export function generateStaticParams() { return []; }
export const revalidate = false;
export const runtime = 'edge';

import { notFound } from 'next/navigation';

export default function PortalCatchAll() {
  // Delegate all unmatched portal routes to the segment-level not-found page
  notFound();
}
