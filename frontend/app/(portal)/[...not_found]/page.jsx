export const dynamic = 'error';
export const dynamicParams = false;
export function generateStaticParams() { return []; }
export const revalidate = false;

export default function LegacyPortalCatchAll() {
  if (process.env.NODE_ENV !== 'production') {
    console.warn("[portal/[...not_found]] is deprecated. Using (portal)/not-found.tsx.");
  }
  return null;
}
