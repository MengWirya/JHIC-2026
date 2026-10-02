# Task 01 - Legacy Website Extraction Audit

## Architecture correction status - 2026-10-02

- Legacy bridge `src/lib/legacy-site.tsx` and catch-all route `src/app/[...legacy]/page.tsx` have been removed.
- HTML and legacy assets now live under `reference/` and are excluded from ESLint; they are not imported by `src/`.
- Native `/berita` listing and `/berita/[slug]` detail routes query Prisma `Konten` records.
- `scripts/migrate-berita.ts` is a manual, idempotent migration utility. It is not called by the application.
- `Konten.slug` is now unique; apply `prisma/migrations/20261002190000_add_konten_slug/migration.sql` before running the importer.

## Source inventory

- Legacy CSS files: 5
- Image assets discovered: 178
- Assets migrated: 176
- Sitemap files: none found
- Legacy HTML and CSS remain under `www.smktelkom-mlg.sch.id/` as the project reference mirror and were not copied into the Next.js source tree.

## Design tokens

The most-used brand-relevant colors found in the legacy CSS were:

- `#1c3547` - primary dark navy used as the main dark brand color
- `#e04e4e` - red accent used by the legacy theme
- `#fff` / `#ffffff` - primary light surface
- `#f8f9fa` - neutral light surface
- `#6c757d` and `#828893` - secondary text tones

The Next.js tokens are now:

- `--brand-primary: #e04e4e`
- `--brand-secondary: #1c3547`

## Fonts

- Google Font detected: Poppins, weights 300, 400, 500, 600, and 700.
- Poppins is loaded through `next/font/google` in `src/app/layout.tsx`.
- Local font files found: Font Awesome brand/solid files only. They were not copied because they are icon fonts, not the site's body font, and the new app already has `lucide-react` available.

## Migrated assets

| Category | Count | Source |
| --- | ---: | --- |
| `public/images/logo/` | 2 | `assets/frontend/images/logo_*.png` |
| `public/images/site/` | 21 | `assets/frontend/images/` and `portflio/` excluding duplicate logos |
| `public/images/berita/` | 145 | `assets/upload/image/thumbs/` |
| `public/images/galeri/` | 6 | `assets/upload/galeri/` |
| `public/images/testimoni/` | 2 | `assets/upload/image/testi/` |
| **Total** | **176** | Filtered school and interface assets |

The source filenames were preserved for traceability. The logo files are provisional legacy assets and should be replaced with official high-resolution versions after the school confirms the brand files.

## Validation notes

- `src/app/globals.css` now uses the audited colors and Poppins font token.
- The root metadata now describes SMK Telkom Malang instead of the Create Next App placeholder.
- The repository lint command currently scans the embedded legacy mirror and reports errors from minified legacy JavaScript. Those findings are outside the new Next.js source and should be excluded from lint scope in a later task.
- No sitemap was available in the mirror, so the legacy URL structure must be reconstructed from the HTML navigation and content folders during route planning.

## TypeScript route migration

- The 260 legacy HTML files are exposed through TypeScript App Router pages rather than copied as new HTML files.
- `src/lib/legacy-site.tsx` reads each legacy document on the server, extracts its body, normalizes internal links, and maps relative asset URLs to `/legacy/assets/`.
- `src/app/[...legacy]/page.tsx` generates the equivalent routes for every legacy HTML path. The homepage is rendered through `src/app/page.tsx`.
- The original CSS files are served locally from `public/legacy/assets/` through the root layout, preserving the reference site's visual rules while allowing the new app to evolve away from them incrementally.
- Production validation completed successfully with 264 generated routes.

## Priority 01 - Native Next.js homepage

- Replaced the homepage's `LegacyDocument` bridge with a native TypeScript/React landing page in `src/app/page.tsx`.
- Added `src/components/site-header.tsx` with a responsive Next.js navigation, mobile menu, sticky state, and PPDB CTA.
- Added native homepage sections for the school's positioning, benefits, study programs, news CTA, and footer.
- Added scoped `.native-*` styles to `src/app/globals.css`, using the audited brand colors, Poppins typography, and migrated school assets.
- Kept `src/app/[...legacy]/page.tsx` for the remaining legacy routes so the broader URL migration can continue incrementally without blocking the native homepage.
- Validation: TypeScript check, focused ESLint, and production build passed; 264 pages generated.
- Final native homepage smoke test: HTTP 200 at `/`, native page/header/hero selectors rendered, and desktop screenshot captured successfully at 1440px.

## Priority 02 - Initial performance isolation

- Removed the five legacy stylesheets from the root layout so native Next.js pages no longer download the legacy Bootstrap/theme CSS by default.
- Legacy stylesheets are now attached only by `src/lib/legacy-site.tsx` when a fallback legacy document is rendered.
- This keeps the native homepage CSS path smaller and preserves styling for the remaining legacy routes while the migration continues.

## Priority 03 - Native Tentang Kami page

- Added `src/app/(public)/tentang-kami/page.tsx` as a native Next.js page for school history, principles, and mission-oriented content.
- Updated the native header to point `Tentang Kami` to `/tentang-kami` instead of the legacy `/p/profil-sekolah` route.
- Added responsive native styles for the about page in `src/app/globals.css`.
- Browser smoke test passed: `/` and `/tentang-kami` returned HTTP 200 with native markup and 0 legacy stylesheets; `/berita` returned HTTP 200 with the legacy fallback and 5 scoped legacy stylesheets.

## Priority 04 - Native MokletBot frontend widget

- Added `src/components/moklet-bot.tsx` as a client-side floating chat widget using the existing `/api/chatbot` POST contract (`{ pertanyaan }`).
- Mounted the widget in `src/app/layout.tsx` so it is available on native and legacy-rendered routes without changing the legacy HTML/CSS implementation.
- Added the pitch-approved quick replies: `Info PPDB 2026`, `Lowongan BKK`, and `Daftar Jurusan`.
- Added user/bot message history, loading/typing state, disabled-submit behavior, and a user-visible fallback for network/API errors.
- Added scoped `.moklet-bot__*` styles in `src/app/globals.css`, including a mobile width constraint and a viewport-safe chat panel height.
- The widget intentionally does not implement a local PPDB form; PPDB remains an external CTA as defined by the product plan.
- Focused validation passed: `npx eslint src/components/moklet-bot.tsx src/app/layout.tsx`.

## Priority 05 - Repository hygiene fixes

- Added `www.smktelkom-mlg.sch.id/**` and `public/legacy/**` to ESLint's global ignores so mirrored HTML/CSS/vendor JavaScript cannot contaminate native source lint results.
- Removed the committed hard-coded MySQL fallback from `prisma.config.ts`.
- Prisma commands now fail explicitly when `DATABASE_URL` is missing; database credentials must come from the environment.
- Replaced the native Career Industries filter anchors with Next.js `Link` components after the cleaned lint run exposed the internal-navigation error.
- Validation: `npm run lint` passes with 0 errors and 5 intentional warnings for stylesheet tags used only by the legacy compatibility renderer.
