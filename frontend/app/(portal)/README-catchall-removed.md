The dynamic catch-all route `(portal)/[...not_found]` was removed to avoid build/runtime issues on Cloudflare Pages.

- Use `(portal)/not-found.tsx` for segment-scoped 404 UI.
- If you later switch back to static export, no changes needed.
- If you reintroduce a catch-all, prefer route handlers/middleware or SSR with Edge runtime per-route.
