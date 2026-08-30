# The Unbound Mystic Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static single-page luxury tarot landing page for The Unbound Mystic with Astrala-inspired editorial pacing, premium service presentation, and a mailto-based inquiry form.

**Architecture:** Use a plain HTML, CSS, and JavaScript site with the provided client images as the primary visual assets. Keep behavior lightweight: semantic sections for the page, CSS-driven atmosphere and responsive layout, and a small script that powers section reveals and the email inquiry form.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js, Vitest, jsdom

---

## File Structure

- Create: `C:/Users/User/Desktop/Codex/Elaine Website/package.json`
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/vitest.config.js`
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/index.html`
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/styles.css`
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/script.js`
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`

### Task 1: Set up the static-site test harness

**Files:**
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/package.json`
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/vitest.config.js`
- Test: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('site shell', () => {
  test('homepage defines the major landing-page sections', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

    expect(html).toContain('id="hero"');
    expect(html).toContain('id="services"');
    expect(html).toContain('id="guidance"');
    expect(html).toContain('id="inquiry"');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because `index.html` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```json
{
  "name": "the-unbound-mystic",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "jsdom": "^26.1.0",
    "vitest": "^2.1.9"
  }
}
```

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom'
  }
});
```

```html
<!doctype html>
<html lang="en">
  <body>
    <section id="hero"></section>
    <section id="services"></section>
    <section id="guidance"></section>
    <section id="inquiry"></section>
  </body>
</html>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS with 1 passing test.

### Task 2: Define page content and service coverage

**Files:**
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/index.html`
- Test: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`

- [ ] **Step 1: Write the failing test**

```js
test('homepage includes all approved service offers', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

  expect(html).toContain('YES/NO Questions');
  expect(html).toContain('3-Month Forecast');
  expect(html).toContain('Love Reading');
  expect(html).toContain('Money/Career Reading');
  expect(html).toContain('Deep Truth & Shadow Work');
  expect(html).toContain('$200');
  expect(html).toContain('$140');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because the placeholder page does not contain the service text yet.

- [ ] **Step 3: Write minimal implementation**

```html
<section id="services">
  <h2>Services</h2>
  <article>
    <h3>YES/NO Questions</h3>
    <p>$40</p>
  </article>
  <article>
    <h3>3-Month Forecast</h3>
    <p>$200</p>
  </article>
  <article>
    <h3>Love Reading</h3>
    <p>$80 - $100</p>
  </article>
  <article>
    <h3>Money/Career Reading</h3>
    <p>$40 - $50</p>
  </article>
  <article>
    <h3>Deep Truth & Shadow Work</h3>
    <p>$140</p>
  </article>
</section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS with service coverage test green.

### Task 3: Add mailto inquiry behavior

**Files:**
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/index.html`
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/script.js`
- Test: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { JSDOM } from 'jsdom';

test('inquiry form creates a populated mailto link', async () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  const dom = new JSDOM(html, {
    runScripts: 'outside-only'
  });

  global.window = dom.window;
  global.document = dom.window.document;

  const module = await import(resolve(process.cwd(), 'script.js'));
  module.initializeInquiryForm();

  document.querySelector('#name').value = 'Ava';
  document.querySelector('#email').value = 'ava@example.com';
  document.querySelector('#service').value = 'Love Reading';
  document.querySelector('#focus').value = 'Need clarity about a relationship';

  document.querySelector('#inquiry-form').dispatchEvent(
    new dom.window.Event('submit', { bubbles: true, cancelable: true })
  );

  expect(document.querySelector('#email-cta').getAttribute('href')).toContain('mailto:');
  expect(document.querySelector('#email-cta').getAttribute('href')).toContain('Love%20Reading');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because the form and script do not exist yet.

- [ ] **Step 3: Write minimal implementation**

```html
<section id="inquiry">
  <form id="inquiry-form">
    <input id="name" name="name" />
    <input id="email" name="email" />
    <select id="service" name="service">
      <option>Love Reading</option>
    </select>
    <textarea id="focus" name="focus"></textarea>
    <button type="submit">Prepare My Inquiry</button>
  </form>
  <a id="email-cta" href="mailto:hello@theunboundmystic.com">Send Inquiry</a>
</section>
```

```js
const INQUIRY_EMAIL = 'hello@theunboundmystic.com';

export function initializeInquiryForm() {
  const form = document.querySelector('#inquiry-form');
  const emailLink = document.querySelector('#email-cta');

  if (!form || !emailLink) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#name')?.value ?? '';
    const email = document.querySelector('#email')?.value ?? '';
    const service = document.querySelector('#service')?.value ?? '';
    const focus = document.querySelector('#focus')?.value ?? '';

    const subject = encodeURIComponent(`The Unbound Mystic Inquiry: ${service}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nService: ${service}\nFocus: ${focus}`
    );

    emailLink.href = `mailto:${INQUIRY_EMAIL}?subject=${subject}&body=${body}`;
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS with inquiry behavior green.

### Task 4: Build the final editorial page presentation

**Files:**
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/index.html`
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/styles.css`
- Modify: `C:/Users/User/Desktop/Codex\Elaine Website/script.js`
- Test: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`

- [ ] **Step 1: Write the failing test**

```js
test('homepage includes Astrala-inspired conversion sections and trust copy', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

  expect(html).toContain('Choose Your Guidance');
  expect(html).toContain('Why Seek Guidance Here');
  expect(html).toContain('The Unbound Mystic');
  expect(html).toContain('divine feminine');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because the current page still contains only minimal placeholder structure.

- [ ] **Step 3: Write minimal implementation**

```html
<link rel="stylesheet" href="styles.css" />
<script type="module" src="script.js"></script>
```

```css
:root {
  --bg: #120708;
  --panel: rgba(37, 12, 16, 0.78);
  --gold: #d4ab62;
  --wine: #6c1123;
  --text: #f4e7d4;
}
```

```js
initializeInquiryForm();
```

Then expand `index.html` into the approved page structure with real content and apply the complete visual system in `styles.css`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS with all content and behavior tests green.

### Task 5: Verify responsive and production-ready output

**Files:**
- Verify only

- [ ] **Step 1: Run full automated test suite**

Run: `npm test`
Expected: PASS with all tests green.

- [ ] **Step 2: Run a static smoke check**

Run: `node -e "console.log(require('fs').existsSync('index.html'))"`
Expected: `true`

- [ ] **Step 3: Open the page locally and inspect desktop/mobile layout**

Run a local static server and verify:
- hero text remains legible
- images render correctly
- service cards stack cleanly on narrow widths
- inquiry CTA remains visible and usable

## Self-Review

Spec coverage:
- Single-page scope covered by `index.html`, `styles.css`, `script.js`
- Required sections covered by Tasks 2-4
- Email inquiry behavior covered by Task 3
- Responsive and final verification covered by Task 5

Placeholder scan:
- No unresolved `TBD` or `TODO` strings in the plan

Type consistency:
- Inquiry form IDs and exported initializer names are consistent across tasks
