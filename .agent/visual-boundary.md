# Visual Boundary - Moklet Hub 2.0 (Temporary)

## Reference Rule

`www.smktelkom-mlg.sch.id` is the visual and content reference repository. It is not a backend dependency and it must not be directly connected to the new public experience.

The new application must copy the useful visual language, layout intent, and approved assets into its own React/CSS implementation. Do not render legacy HTML as a shortcut for new features.

## Allowed

- Inspect legacy HTML, CSS, images, and responsive behavior to understand the original site.
- Reuse approved image/logo assets by copying or placing them in the new app's `public/images` structure.
- Recreate layouts and interactions in new components and project-owned CSS.
- Keep the existing legacy catch-all route available for compatibility while migration is incomplete.
- Make targeted UI fixes when a reference behavior is broken or when the user explicitly approves broader visual change.

## Not Allowed Without Explicit Approval

- Replacing the native landing page with the legacy HTML renderer.
- Importing the legacy stylesheet into a new native page.
- Making the new application fetch or depend on the old site at runtime.
- Massively changing the original reference UI direction.
- Introducing a new visual system merely because it is easier to implement.
- Creating a local PPDB form when the agreed behavior is an external link.

## Working Principle

Preserve recognizable structure, hierarchy, branding, and interaction expectations from the reference. Improve implementation quality, responsiveness, accessibility, and data behavior within that boundary. Any substantial redesign requires explicit approval first.

## Review Checklist for Every UI Change

- Is this a native component or a legacy compatibility route?
- Does it preserve the reference site's recognizable intent?
- Does it use project-owned CSS and assets?
- Does it work at desktop, tablet, and mobile widths?
- Does it avoid text stacking and overflow?
- Does it avoid introducing a new navigation or content workflow that was not in scope?
