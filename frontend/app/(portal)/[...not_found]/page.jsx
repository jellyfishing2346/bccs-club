export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';

export default function PortalCatchAll() {
  notFound();
}
