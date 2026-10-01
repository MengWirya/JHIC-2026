# Moklet Hub 2.0 - Project Understanding (Temporary)

> Working foundation for the rework. This document is temporary and should be replaced or folded into the final project documentation once the product direction is approved.

## 1. Product Purpose

Moklet Hub is the new public-facing digital home for SMK Telkom Malang. It should present the school as a technology-focused vocational school, make its programs and industry relationships easy to understand, and provide a practical path to important information.

The competition/pitch scope is intentionally narrow:

- Landing page and school positioning
- Three vocational programs: RPL, TKJ, and Pengembangan Gim
- Career Industries: companies, role/major tags, and testimonials
- MokletBot powered by the school's FAQ knowledge base
- Prestasi, berita, galeri, and BLUD content managed as publishable content
- PPDB as an external link only
- Admin operations for content and FAQ maintenance

The project is not intended to become a general-purpose school portal or a replacement for the existing PPDB system.

## 2. Current Technical Baseline

- Framework: Next.js 16.3.7 with React 19 and TypeScript
- Styling: Tailwind CSS v4 is installed, while the current native pages primarily use scoped CSS classes in `src/app/globals.css`
- Database: Prisma 7 with a MySQL datasource and MariaDB adapter dependency
- Authentication: NextAuth/Auth.js credentials flow is configured in the codebase
- Icons: `lucide-react`
- Images: local assets under `public/images`, rendered with `next/image` in the new pages
- Legacy material: downloaded HTML/CSS/assets under `www.smktelkom-mlg.sch.id` and `public/legacy`

## 3. Current Route and UI State

### New/native experience

- `/` has a native landing page with hero, school benefits, three programs, a news CTA, header, and footer.
- `/tentang-kami` has a native About page with school story, principles, and a program CTA.
- `/career-industries` has an early server-rendered database page with company queries and tag filtering. It still needs the intended visual treatment, empty/loading states, and production content.
- The root layout loads Poppins and Geist Mono and currently exposes global brand tokens.
- A chatbot frontend widget is not yet present in the root layout.

### Legacy compatibility experience

- The catch-all route can read HTML files from `www.smktelkom-mlg.sch.id`, extract their body, rewrite relative URLs, and render them with the legacy CSS.
- This is a compatibility/reference mechanism. It is not the implementation model for new pages.
- The legacy renderer is not the source of truth for new application data or new UI components.

## 4. Data Model Understanding

The database supports these models:

- `Admin`: content/company ownership and admin role
- `Konten`: generic publishable records for `PRESTASI`, `BERITA`, `BLUD`, and `GALERI`
- `Perusahaan`: industry/company profiles
- `TagJurusan`: reusable career/major tags
- `PerusahaanTag`: many-to-many company/tag relationship
- `Testimoni`: testimonials attached to a company
- `Faq`: MokletBot knowledge base
- `ChatLog`: optional conversation log for evaluating FAQ coverage
- `PesanMasuk`: incoming school questions/service messages

The intended content workflow is database-backed: public pages read published content, while admin workflows create/update it. PPDB remains outside this database and application boundary.

## 5. Important Behavioral Boundaries

- New public pages should use their own React components, local image assets, and project CSS.
- New pages must not directly embed or depend on `www.smktelkom-mlg.sch.id` HTML.
- Legacy CSS may remain available only for legacy compatibility routes and visual reference.
- PPDB CTA must leave the site and point to the existing PPDB domain; do not build a duplicate registration form.
- MokletBot must answer from the FAQ knowledge base and clearly defer unsupported questions to the school contact.
- Public data should distinguish draft from published content.
- Admin routes must be protected before CRUD work is considered complete.

## 6. Known Gaps and Risks

- Database setup, migrations, seed data, and production environment variables are not yet verified in this workspace.
- The chatbot API depends on a configured Anthropic key, a working database, and FAQ records; the backend route exists but should not be treated as production-ready until those dependencies are tested.
- The current chatbot rate limiter is process-memory based and is suitable only for modest single-instance traffic.
- The Career Industries page is functionally useful but visually separate from the native design system.
- The plan mentions a 7-table schema, but the current Prisma schema contains 8 models when the optional `ChatLog` model is counted.
- The current global stylesheet still contains legacy-specific rules and a dark-mode media override; visual cleanup should be handled deliberately rather than accidentally changing legacy pages.
- Existing and future pages need link/route verification because several navigation targets are legacy-compatible paths or planned pages rather than completed native pages.

## 7. Immediate Implementation Order

1. Verify database connectivity, Prisma generation/migration state, and seed strategy.
2. Stabilize the native shell: header, responsive behavior, typography, colors, and shared section patterns.
3. Complete the landing page using database-backed Prestasi, BLUD, company, and testimonial sections without changing the established visual direction.
4. Build the MokletBot widget and mount it in the root layout.
5. Bring Career Industries into the native visual system and add explicit empty/loading/error behavior.
6. Implement protected admin workflows and FAQ/content CRUD.
7. Perform responsive, accessibility, metadata, image, redirect, and Lighthouse work after core behavior is stable.

## 8. Definition of Done for the Foundation

The foundation is understood when a contributor can answer:

- Which parts are new native UI and which parts are legacy compatibility?
- Which features are required for the pitch and which are optional polish?
- Which records power each public section?
- Why is PPDB not implemented locally?
- What must be verified before calling the API or admin features complete?
