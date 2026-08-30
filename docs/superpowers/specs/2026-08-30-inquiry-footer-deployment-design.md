# The Unbound Mystic Inquiry, Footer, and Deployment Design

**Project date:** August 30, 2026

## Goal

Simplify the Inquiry section, add an automatically updating copyright footer, and prepare the static site for client review deployment with a Vercel-first hosting attempt and defined free fallbacks.

## Requested Changes

- keep only the inquiry form in the Inquiry section
- remove the Next step card from the Inquiry section
- add a copyright line at the bottom of the page
- make the copyright year update automatically from the system date
- deploy to Vercel first if local credentials and tooling allow it
- if Vercel deployment fails, try a free fallback host
- if the first free fallback fails, try GitHub Pages as a final fallback

## Scope

Included:
- HTML cleanup for the Inquiry section
- CSS cleanup for the Inquiry layout after removing the side panel
- minimal JavaScript for dynamic footer year rendering
- deployment preparation for a static hosting workflow
- deployment attempts in this order:
  - Vercel
  - Netlify or Cloudflare Pages
  - GitHub Pages if earlier paths fail

Excluded:
- changes to the inquiry form fields
- changes to mailto behavior
- broader footer redesign beyond the copyright line
- backend or CMS work

## Inquiry Section Design

The Inquiry section should become a single-column form section. The existing introductory text remains, followed by the form only. The current Next step card should be removed entirely rather than hidden with CSS.

The change should preserve:
- the current form fields
- the current form styling language
- the existing mailto workflow
- the full-width intro treatment already approved

After the side card is removed, the section should still feel intentional rather than empty. CSS should be simplified so the form occupies the available width cleanly without leaving grid behavior that only existed to support the removed panel.

## Footer Design

The footer should end with a copyright line that includes:
- the copyright symbol
- the current year
- the brand name

Target format:
- `© {currentYear} The Unbound Mystic. All rights reserved.`

The year should come from the system date at runtime in the browser so it updates automatically in future years without manual edits.

If JavaScript fails to run, the footer should still remain readable. The fallback can be either:
- a serverless-free static default year in the HTML that JavaScript replaces when available
- or a structure where the full line renders with a reasonable default and only the year token is updated

## Technical Direction

The site should remain a lightweight static site:
- `index.html`
- `styles.css`
- `script.js`

The footer year update should be minimal and use the existing `script.js` file rather than introducing new infrastructure.

The implementation should follow progressive enhancement:
- the page must remain readable if JavaScript does not run
- the footer year enhancement should layer on top of valid static HTML

## Deployment Direction

### Primary Target: Vercel

Attempt deployment to Vercel first, using local credentials if they are already available once the CLI or equivalent path is installed and usable in this environment.

Because this is a static site, the deployment should avoid unnecessary framework setup. If Vercel is used, the site should be deployed as a plain static project.

### Fallback Targets

If Vercel cannot be used successfully from this environment, try free static hosting in this order:

1. Netlify or Cloudflare Pages
2. GitHub Pages if the earlier fallback path also fails

Selection between Netlify and Cloudflare Pages can be based on whichever path is operational with the least friction in the current environment.

### Deployment Deliverable

The user wants a client-reviewable link. The final outcome should therefore be:
- one working public review URL if deployment succeeds
- or a precise explanation of the blocking point if all deployment targets fail

## Testing

Automated checks should cover:
- the Inquiry section no longer includes the next-step panel
- the inquiry form still exists and retains its current identifiers
- the footer contains the copyright structure
- the year-rendering logic updates the target element using the current system year
- mailto behavior still works

Manual verification should cover:
- the Inquiry section still feels balanced with only the form present
- the footer displays correctly on desktop and mobile
- the deployed site renders correctly from the public URL

## Assumptions

- the existing static site structure remains the correct architecture
- Vercel credentials may already exist but are not yet confirmed in this shell environment
- free fallback hosting is acceptable for client review if Vercel cannot be used
- turning the project into a git repository may be required only if GitHub Pages becomes necessary
