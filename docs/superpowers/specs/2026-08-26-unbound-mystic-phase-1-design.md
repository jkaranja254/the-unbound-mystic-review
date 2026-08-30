# The Unbound Mystic Phase 1 Design

**Project date:** August 26, 2026

## Goal

Build a single long-scrolling luxury tarot landing page for `The Unbound Mystic` that borrows the polished editorial rhythm of `Astrala` while centering a single practitioner, her premium offers, and an email-based inquiry funnel.

## Scope

Phase 1 covers a single-page marketing site only.

Included:
- One long-scrolling landing page
- Hero led by the client portrait
- Editorial luxury copy centered on services, aesthetic, and trust cues
- Services and pricing presentation
- A guidance-path section inspired by Astrala's category-style navigation
- A styled inquiry form that routes to email
- Minimal footer and minimal policy/disclaimer language

Excluded:
- Interactive calculators
- Blog or article hub
- Multi-page site structure
- Booking/payment automation
- Submission storage backend
- Testimonials

## Reference Interpretation

`Astrala.com` is being used as a structural and tonal reference, not as a content model to replicate literally. The site should borrow:
- editorial section pacing
- elevated spiritual language
- premium card-based presentation
- polished conversion flow

It should not imitate Astrala by pretending to be a large astrology content platform. This site remains a focused practitioner brand site.

## Visual Direction

The approved direction is `Astrala hybrid`.

Visual principles:
- intimate, regal, cinematic mood
- rich burgundy, black, espresso, and warm gold palette
- strong use of candlelight, tarot, crystals, roses, and celestial symbols
- divine feminine, sensual, sovereign tone
- the client portrait is the primary authority image
- supporting imagery comes from the attached tarot still-life collage

## Content Strategy

The page should be written around:
- services
- aesthetic identity
- trust cues

The page should not depend on:
- testimonials
- a long founder biography
- heavy legal/policy text

Trust will be built through tone, clarity, intentional structure, premium art direction, and confident service framing.

## Page Structure

### 1. Hero

Purpose:
- establish mood immediately
- present the client as the face of the brand
- communicate clarity, intuition, and divine feminine authority
- drive visitors toward the inquiry section

Content:
- brand line for `The Unbound Mystic`
- elevated headline
- short supporting copy
- primary CTA scrolling to inquiry
- secondary CTA scrolling to services

### 2. Mystic Intro Band

Purpose:
- transition from visual seduction into editorial positioning
- frame the readings as tools for clarity in love, career, timing, and transformation

Content style:
- short, polished, magazine-like copy
- not a casual welcome paragraph

### 3. Services Showcase

Services to include:
- Yes/No Questions
- 3-Month Forecast
- Love Reading
- Money/Career Reading
- Deep Truth & Shadow Work

Requirements:
- show each service as a premium offer card or panel
- include duration and pricing
- keep descriptions elevated and digestible
- preserve the exact service distinctions provided by the client

### 4. Reading Paths / Choose Your Guidance

Purpose:
- help visitors self-sort quickly
- borrow Astrala's category-navigation logic without turning the page into a content hub

Paths:
- Love
- Career
- Clarity
- Shadow Work
- Future Forecast

Each path should point visitors toward the relevant service.

### 5. Why Work With Her

Purpose:
- replace missing testimonials with positioning-based trust

Trust cues to highlight:
- intuitive depth
- thoughtful, reflective guidance
- pre-recorded convenience
- spiritual clarity without fear-based language
- premium, intentional experience

### 6. Visual Atmosphere Section

Purpose:
- deepen immersion
- keep the page cinematic and image-rich
- use the still-life imagery as world-building support

This section can combine layered imagery, short statements, and symbolic motifs.

### 7. Inquiry Section

Purpose:
- convert interest into a direct message

Requirements:
- styled premium inquiry form
- mailto-based email submission
- fields for name, email, selected service, and question/focus area
- optional field for timing or context if it improves lead quality
- copy should read as an invitation, not a sterile contact form

## Form Behavior

Because the user chose email-only handling, the form should:
- collect the visitor's information locally in the browser
- generate a `mailto:` destination
- prefill subject and body with the chosen service and inquiry details

The implementation should make the destination email address easy to replace.

## Footer

Minimal footer content:
- brand name
- optional social/contact placeholder
- brief closing line
- very light disclaimer/policy note only if needed for tone balance

## Technical Direction

Phase 1 should be built as a lightweight static site:
- `index.html`
- `styles.css`
- `script.js`

Reasoning:
- the workspace is empty
- this phase does not need a CMS or backend
- a static build keeps the delivery simple and fast
- a mailto-based inquiry flow does not justify a framework or server

## Responsiveness

The layout must work on:
- desktop
- tablet
- mobile

Priority behaviors:
- hero remains legible on small screens
- service cards stack cleanly
- inquiry form remains easy to complete on mobile
- imagery scales without breaking the atmosphere

## Motion

Motion should be present but restrained:
- soft reveal or fade-up effects
- subtle glow/parallax feeling where lightweight
- no gimmicky animation loops

## Testing

The implementation should include automated checks for:
- presence of required sections
- presence of the service offerings and pricing text
- correct inquiry form behavior for mailto generation

Manual verification should also include:
- responsive layout checks
- visual confirmation that the page mood matches the approved direction

## Assumptions

- No official bio is required for phase 1
- No testimonials are available
- No payment or booking tool is connected yet
- No existing repository or framework must be preserved
- A placeholder inquiry email may be required if the client address is not yet provided
