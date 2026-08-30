# Guidance and Services Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the landing page by removing all `Luxury` wording, restructuring Services and Guidance, adding a generated Guidance image, enlarging section headings, and widening the Inquiry intro without changing the inquiry workflow.

**Architecture:** Keep the site as a static `index.html` + `styles.css` + `script.js` build. Use small HTML structure hooks (`services-shell`, `service-row-*`, `guidance-layout`, `guidance-visual`, `inquiry-intro`) so Vitest can verify the refreshed markup while CSS owns the visual behavior and `script.js` remains unchanged.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Vitest, JSDOM, image generation for the new local asset

---

## File Structure

- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`
  Responsibility: add regression coverage for the new HTML structure, the `Luxury` copy removal, the generated Guidance asset reference, and the new CSS hooks.
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/index.html`
  Responsibility: remove `Luxury` wording, add the new Services row wrappers, add the Guidance split layout and image reference, and widen the Inquiry intro block.
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/styles.css`
  Responsibility: increase shared section-heading sizing, implement the `3 + 2` Services layout, equal-height top-aligned Guidance cards, Guidance image framing, and the full-width Inquiry intro.
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/guidance-symbolic.png`
  Responsibility: provide the new Guidance section artwork in the established brand palette.
- No change expected: `C:/Users/User/Desktop/Codex/Elaine Website/script.js`
  Responsibility: keep the mailto workflow untouched because the request excludes form behavior changes.

### Task 1: Refresh the HTML structure, copy, and Guidance asset reference

**Files:**
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/index.html`
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/guidance-symbolic.png`
- Test: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`

- [ ] **Step 1: Write the failing HTML regression test**

Add the helper and test below to `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js` near the other HTML content assertions:

```js
const cssPath = resolve(process.cwd(), 'styles.css');

function loadCss() {
  return readFileSync(cssPath, 'utf8');
}

test('removes luxury copy and adds the refreshed section structure', () => {
  const html = loadHtml();

  expect(html).not.toMatch(/luxury/i);
  expect(html).toContain('class="services-shell"');
  expect(html).toContain('class="service-row service-row-primary"');
  expect(html).toContain('class="service-row service-row-secondary"');
  expect(html).toContain('class="guidance-layout"');
  expect(html).toContain('class="guidance-visual"');
  expect(html).toContain('guidance-symbolic.png');
  expect(html).toContain('class="inquiry-intro"');
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `pnpm test -- tests/site.test.js --testNamePattern "removes luxury copy and adds the refreshed section structure"`

Expected: `FAIL` because `/luxury/i` still matches the HTML and the new structure hooks are not present yet.

- [ ] **Step 3: Generate the Guidance image asset**

Create `C:/Users/User/Desktop/Codex/Elaine Website/guidance-symbolic.png` with this prompt:

```text
Create a polished editorial illustration for a tarot guidance website section. Show a feminine spiritual figure or silhouette with celestial motifs, subtle aura shapes, and soft symbolic detailing. Use deep burgundy, espresso, warm gold, and soft blush accents drawn from the site palette. The mood should feel refined, atmospheric, intimate, and powerful rather than stock-photo literal. No text. Compose it to work as a website section image with enough negative space to breathe.
```

Use a landscape or gently portrait-leaning crop that fits a card-like website image frame without needing additional text overlays.

- [ ] **Step 4: Write the minimal HTML changes**

Update the key sections in `C:/Users/User/Desktop/Codex/Elaine Website/index.html` to match this structure and copy direction:

```html
<meta
  name="description"
  content="The Unbound Mystic offers tarot guidance for love, career, clarity, and shadow work."
/>
```

```html
<p class="eyebrow">Tarot guidance for the intuitive and becoming</p>
```

```html
<ul class="hero-notes" aria-label="Experience highlights">
  <li>Pre-recorded readings delivered with intention</li>
  <li>Love, money, career, clarity, and shadow work</li>
  <li>Editorial atmosphere inspired by the mystic arts</li>
</ul>
```

```html
<section id="services" class="services reveal">
  <div class="section-heading services-heading">
    <p class="section-kicker">Offerings</p>
    <h2>Services designed to meet the exact question, season, or transformation in front of you.</h2>
  </div>
  <div class="services-shell">
    <div class="service-row service-row-primary">
      <article class="service-card" id="service-yes-no">
        <p class="service-tag">10 min pre-recorded</p>
        <h3>YES/NO Questions</h3>
        <p class="service-price">$40 - $60</p>
        <p>
          Quick, focused insight for the question you need answered now.
        </p>
        <ul>
          <li>Option 1: One Question, 1 Tarot Card Pull, 1 Oracle Card - $40</li>
          <li>Option 2: One Question plus one follow-up and an extra Tarot Card Pull - $60</li>
        </ul>
      </article>
      <article class="service-card" id="service-forecast">
        <p class="service-tag">45 min deep dive</p>
        <h3>3-Month Forecast</h3>
        <p class="service-price">$200</p>
        <p>
          A detailed reading across the next three months for your general
          path, love life, or career direction.
        </p>
        <ul>
          <li>Month-by-month energetic overview</li>
          <li>Key opportunities and possible challenges</li>
          <li>Add-on Oracle or channeled message available for $10</li>
        </ul>
      </article>
      <article class="service-card" id="service-love">
        <p class="service-tag">15 min pre-recorded</p>
        <h3>Love Reading</h3>
        <p class="service-price">$80 - $100</p>
        <p>
          Relationship clarity for the heart that wants truth without losing
          tenderness.
        </p>
        <ul>
          <li>Coupled reading - $80 with a 4-card spread and Oracle insight</li>
          <li>Single reading - $100 exploring timelines, blocks, and your next partner with a 6-card spread and 1 Oracle</li>
        </ul>
      </article>
    </div>
    <div class="service-row service-row-secondary">
      <article class="service-card" id="service-money">
        <p class="service-tag">10 min focused reading</p>
        <h3>Money/Career Reading</h3>
        <p class="service-price">$40 - $50</p>
        <p>
          Guidance for crossroads, pivots, purpose, and practical next steps
          in your professional path.
        </p>
        <ul>
          <li>Current path reading - $40 with outcomes, obstacles, and opportunities</li>
          <li>Pivot Point reading - $50 for career change, entrepreneurship, or purpose alignment</li>
        </ul>
      </article>
      <article class="service-card" id="service-shadow">
        <p class="service-tag">30 min tarot and oracle</p>
        <h3>Deep Truth &amp; Shadow Work</h3>
        <p class="service-price">$140</p>
        <p>
          For the woman ready to identify what is blocking her manifestations,
          interrupt repeated patterns, and meet her purpose with honesty.
        </p>
        <ul>
          <li>Identify blocks beneath repeated experiences</li>
          <li>Receive guided angel messages for release and direction</li>
          <li>Gain deeper clarity around purpose, patterns, and self-trust</li>
        </ul>
      </article>
    </div>
  </div>
</section>
```

```html
<section id="guidance" class="guidance reveal">
  <div class="guidance-layout">
    <div class="guidance-overview">
      <div class="section-heading guidance-heading">
        <p class="section-kicker">Choose the path</p>
        <h2>Choose Your Guidance</h2>
        <p>
          Inspired by Astrala's category-led flow, this section helps visitors
          find the reading aligned with what life is asking of them right now.
        </p>
      </div>
      <figure class="guidance-visual">
        <img
          src="guidance-symbolic.png"
          alt="A feminine symbolic illustration with celestial motifs in burgundy and gold."
        />
      </figure>
    </div>
    <div class="guidance-grid">
      <a class="guidance-card" href="#service-love">
        <span class="guidance-label">Love</span>
        <strong>For relationship clarity, timelines, and emotional truth</strong>
      </a>
      <a class="guidance-card" href="#service-money">
        <span class="guidance-label">Career</span>
        <strong>For pivots, money moves, and purpose-aligned direction</strong>
      </a>
      <a class="guidance-card" href="#service-yes-no">
        <span class="guidance-label">Clarity</span>
        <strong>For the immediate answer your spirit keeps circling back to</strong>
      </a>
      <a class="guidance-card" href="#service-shadow">
        <span class="guidance-label">Shadow Work</span>
        <strong>For pattern-breaking, release, and deeper personal truth</strong>
      </a>
      <a class="guidance-card" href="#service-forecast">
        <span class="guidance-label">Future Forecast</span>
        <strong>For a broader energetic map of the next three months</strong>
      </a>
    </div>
  </div>
</section>
```

```html
<section id="inquiry" class="inquiry reveal">
  <div class="section-heading inquiry-intro">
    <p class="section-kicker">Begin the conversation</p>
    <h2>Tell me what you are seeking, and I will meet the question with care.</h2>
    <p>
      Complete the form below to prepare your inquiry email. You will be
      taken to your email app with the details already organized.
    </p>
  </div>
  <div class="inquiry-layout">
    <form id="inquiry-form" class="inquiry-form">
      <label>
        Your name
        <input id="name" name="name" type="text" placeholder="Enter your name" required />
      </label>
      <label>
        Email address
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </label>
      <label>
        Select your service
        <select id="service" name="service" required>
          <option value="">Choose one</option>
          <option value="YES/NO Questions">YES/NO Questions</option>
          <option value="3-Month Forecast">3-Month Forecast</option>
          <option value="Love Reading">Love Reading</option>
          <option value="Money/Career Reading">Money/Career Reading</option>
          <option value="Deep Truth & Shadow Work">Deep Truth & Shadow Work</option>
        </select>
      </label>
      <label>
        What would you like clarity on?
        <textarea
          id="focus"
          name="focus"
          rows="5"
          placeholder="Share the question, situation, or area of life you want the reading to explore."
          required
        ></textarea>
      </label>
      <label>
        Timing or context
        <input
          id="timing"
          name="timing"
          type="text"
          placeholder="Optional details about urgency, timelines, or recent shifts"
        />
      </label>
      <button class="button button-primary form-button" type="submit">
        Prepare My Inquiry Email
      </button>
    </form>
    <aside class="inquiry-panel">
      <p class="inquiry-panel-label">Next step</p>
      <h3>Your inquiry will open as a drafted email.</h3>
      <p id="form-feedback">
        Fill in your details, then use the prepared link below to send your
        message directly.
      </p>
      <a
        id="email-cta"
        class="button button-secondary email-cta"
        href="mailto:hello@theunboundmystic.com"
      >
        Open Prepared Email
      </a>
    </aside>
  </div>
</section>
```

Also replace the remaining visible `Luxury` strings with these exact copy updates:

```html
<h3>Rich ritual mood, grounded truth</h3>
```

```html
<p class="footer-copy">
  Tarot guidance for clarity, timing, and sacred self-trust.
</p>
```

- [ ] **Step 5: Run the focused test to verify it passes**

Run: `pnpm test -- tests/site.test.js --testNamePattern "removes luxury copy and adds the refreshed section structure"`

Expected: `PASS`

- [ ] **Step 6: Record completion instead of committing**

Do not run `git commit` here. The workspace root `C:/Users/User/Desktop/Codex/Elaine Website` is not a git repository, so record task completion in the execution thread and continue.

### Task 2: Add the layout and typography rules for the refreshed sections

**Files:**
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/styles.css`
- Test: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`

- [ ] **Step 1: Write the failing CSS regression test**

Add this test to `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js` after the HTML structure test:

```js
test('defines the refreshed services, guidance, and inquiry layout styles', () => {
  const css = loadCss();

  expect(css).toContain('--section-heading-size');
  expect(css).toContain('.services-shell');
  expect(css).toContain('.service-row-primary');
  expect(css).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));');
  expect(css).toContain('.service-row-secondary');
  expect(css).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));');
  expect(css).toContain('.guidance-layout');
  expect(css).toContain('.guidance-overview');
  expect(css).toContain('.guidance-visual');
  expect(css).toContain('.guidance-card strong');
  expect(css).toContain('font-size: 2rem;');
  expect(css).toContain('.inquiry-intro');
  expect(css).toContain('grid-column: 1 / -1;');
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `pnpm test -- tests/site.test.js --testNamePattern "defines the refreshed services, guidance, and inquiry layout styles"`

Expected: `FAIL` because the new CSS custom property and layout selectors are not in `styles.css` yet.

- [ ] **Step 3: Write the minimal CSS changes**

Update `C:/Users/User/Desktop/Codex/Elaine Website/styles.css` with these additions and replacements:

```css
:root {
  --bg: #120608;
  --bg-soft: #1b0d10;
  --panel: rgba(31, 12, 15, 0.82);
  --panel-strong: rgba(53, 18, 25, 0.9);
  --gold: #d8b06a;
  --gold-soft: #f2debf;
  --wine: #6d1225;
  --rose: #b75568;
  --text: #f5eadc;
  --muted: #d0baa0;
  --border: rgba(216, 176, 106, 0.26);
  --shadow: 0 30px 70px rgba(0, 0, 0, 0.35);
  --max-width: 1200px;
  --section-heading-size: clamp(2.525rem, 5vw, 4.125rem);
}
```

```css
.intro-panel h2,
.section-heading h2,
.trust-copy h2,
.atmosphere-copy h2 {
  margin: 0.4rem 0 1rem;
  font-size: var(--section-heading-size);
}

.services-heading,
.inquiry-intro {
  max-width: none;
  width: 100%;
}

.services-shell {
  display: grid;
  gap: 1.25rem;
}

.service-row {
  display: grid;
  gap: 1.25rem;
  align-items: stretch;
}

.service-row-primary {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.service-row-secondary {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.service-card {
  height: 100%;
}
```

```css
.guidance-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 1.5rem;
  align-items: stretch;
}

.guidance-overview {
  display: grid;
  gap: 1.25rem;
  align-content: start;
}

.guidance-heading {
  max-width: none;
  margin-bottom: 0;
}

.guidance-visual {
  overflow: hidden;
  min-height: 100%;
  border: 1px solid var(--border);
  border-radius: 1.75rem;
  box-shadow: var(--shadow);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(109, 18, 37, 0.28)),
    rgba(12, 4, 6, 0.82);
}

.guidance-visual img {
  width: 100%;
  height: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.guidance-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: stretch;
}

.guidance-card {
  min-height: 15rem;
  justify-content: flex-start;
  align-items: flex-start;
}

.guidance-card strong {
  display: block;
  font-size: 2rem;
  line-height: 1;
}
```

```css
.inquiry {
  display: grid;
  gap: 2rem;
}

.inquiry-layout {
  grid-template-columns: 1.1fr 0.9fr;
}

.inquiry-intro {
  grid-column: 1 / -1;
  margin-bottom: 0;
}
```

```css
@media (max-width: 1100px) {
  .service-row-primary,
  .service-row-secondary,
  .guidance-layout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .guidance-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .service-row-primary,
  .service-row-secondary,
  .guidance-layout,
  .guidance-grid {
    grid-template-columns: 1fr;
  }

  .guidance-card {
    min-height: auto;
  }
}
```

Keep the existing palette, card backgrounds, and inquiry form styling unless a selector must be moved to support these new hooks.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `pnpm test -- tests/site.test.js --testNamePattern "defines the refreshed services, guidance, and inquiry layout styles"`

Expected: `PASS`

- [ ] **Step 5: Record completion instead of committing**

Do not run `git commit` here. The workspace does not have a `.git` directory, so note completion in the execution thread and continue.

### Task 3: Run the full regression suite and perform visual verification

**Files:**
- Modify: none
- Test: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`
- Inspect: `C:/Users/User/Desktop/Codex/Elaine Website/index.html`

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`

Expected: `PASS` for all Vitest cases, including the existing mailto behavior coverage.

- [ ] **Step 2: Open the page for manual verification**

Run: `Start-Process "C:\Users\User\Desktop\Codex\Elaine Website\index.html"`

Expected: the landing page opens in the default browser.

- [ ] **Step 3: Verify the required visual outcomes**

Check the page manually at desktop, tablet, and mobile widths using this checklist:

```text
- No visible or metadata occurrence of "Luxury"
- Services reads as a deliberate 3-card row followed by a 2-card row on desktop
- Guidance shows the new feminine symbolic image and no longer feels text-only
- Guidance card labels and larger headings start from the same top position
- Section headings read slightly larger across the page
- Inquiry intro spans full width before the form/panel row
- Inquiry form and next-step panel content remain unchanged
```

- [ ] **Step 4: Record completion instead of committing**

Do not run `git commit` here. Capture the successful test run and manual verification results in the execution thread.
