# The Unbound Mystic Guidance and Services Refresh Design

**Project date:** August 28, 2026

## Goal

Refine the existing landing page so the copy, section structure, and visual balance feel more intentional without changing the overall single-page architecture or the inquiry workflow.

## Requested Changes

- remove the word `Luxury` everywhere it appears
- make the Services section full-width
- arrange the Services cards into two rows on desktop:
  - first row with three cards
  - second row with two cards
- rebalance the Guidance section so it is not text-only
- increase the Guidance card headings and align their content uniformly from the top
- generate and insert a new Guidance section image using the site brand colors
- increase all section headings by roughly `2pt`
- make the free-text content area of the Inquire section full-width
- do not change the inquiry form block
- do not change the next steps card

## Scope

Included:
- copy cleanup across HTML content and metadata
- layout refinement for Services
- layout and art-direction refinement for Guidance
- section heading typography adjustment
- inquiry intro layout refinement
- test updates that reflect the new content and structure expectations

Excluded:
- changes to inquiry form fields or behavior
- changes to the next steps card
- changes to the mailto submission logic
- a broader visual redesign outside the named sections

## Content Rules

The term `Luxury` must be removed everywhere, including:
- hero or support copy
- trust-section copy
- footer copy
- metadata such as the page description

Replacement copy should preserve the elevated tone of the site while shifting emphasis toward clarity, reflection, timing, and intentional guidance.

## Services Section Design

### Layout

The Services section should break out of the narrower text measure and read as a full-width showcase. The card arrangement on desktop should be explicit rather than auto-flowing:

- row one: three cards
- row two: two cards

The second row should feel deliberate and balanced rather than like leftover items wrapping naturally from the first row. On tablet and mobile, the layout should collapse cleanly into fewer columns without preserving the desktop row constraint when that would hurt readability.

### Card Treatment

Existing service content, anchors, and pricing remain intact unless a copy adjustment is required solely to remove `Luxury`. The update should preserve the premium editorial tone and the current service hierarchy while relying on layout spacing rather than novelty effects.

## Guidance Section Design

### Purpose

The Guidance section should feel more balanced and less like a wall of text cards. It remains a conversion-assist section that helps visitors self-sort into the right service path.

### Composition

The approved direction is an editorial split layout:

- a text-and-image content area that introduces the section
- a uniform card grid for the five guidance pathways

Depending on breakpoint, the image and intro copy can sit beside the card grid or stack above it, but the section should always preserve a clear visual anchor that breaks up the text density.

### Image Direction

The new image should follow the approved `feminine symbolic` direction:

- a spiritual feminine figure or silhouette
- celestial motifs
- brand-aligned burgundy, espresso, warm gold, and soft blush accents
- polished and atmospheric rather than literal stock-photo realism

The image serves as supporting editorial art inside Guidance, not as a replacement for the hero imagery.

### Card Uniformity

All Guidance cards should present consistently:

- larger card headings for stronger hierarchy
- labels and headings aligned from the same top position
- equal-height cards on desktop rows
- content pinned toward the top so cards do not look visually uneven when copy lengths differ

The cards should remain clearly clickable and continue linking to their related services.

## Section Heading Typography

All section-level `h2` headings should increase by roughly `2pt` through a shared styling rule so the page scales consistently. The change should apply across sections rather than through isolated one-off overrides unless the current CSS architecture makes a shared rule impractical.

## Inquiry Section Design

The Inquiry section should keep its current form and next steps card structure, but the introductory free-text block should span the full available width before the form region begins. This is a layout refinement only, not a content-system or behavior change.

## Testing

Automated checks should be updated to verify:

- `Luxury` no longer appears in the page HTML
- the major section anchors still exist
- the expected services and pricing text still exists
- the Guidance section still includes its editorial pathing content
- inquiry mailto behavior remains unchanged

Manual verification should confirm:

- the Services section reads as a deliberate `3 + 2` desktop arrangement
- the Guidance section feels visually balanced
- Guidance cards align uniformly
- the new image feels native to the brand
- the Inquire section intro spans full width without disturbing the form and next steps card
- responsive behavior remains intact on tablet and mobile

## Assumptions

- current service offerings and pricing remain unchanged
- the generated Guidance image will be stored locally in the project and referenced by the page
- no booking or backend workflow changes are needed
- the project remains a lightweight static site
