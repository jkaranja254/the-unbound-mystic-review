# Inquiry Footer and Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the Inquiry section to a form-only layout, add an auto-updating copyright footer year, and publish the static site to a client-reviewable URL with a Vercel-first deployment path and free fallbacks.

**Architecture:** Keep the site as static HTML, CSS, and vanilla JavaScript, with the year injected through progressive enhancement in the existing `script.js`. Add a tiny packaging script that builds a clean `dist/` folder containing only the client-facing assets so Vercel, Netlify, Cloudflare Pages, and GitHub Pages can deploy the same output without exposing `docs/`, `tests/`, or local tooling files.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js `fs`, Vitest, JSDOM, Vercel CLI via `npx`, Netlify CLI via `npx`, Wrangler via `npx`, Git/GitHub CLI for the final fallback

---

## File Structure

- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/index.html`
  Responsibility: remove the Inquiry next-step panel, add the footer copyright markup, and keep the public-facing structure simple.
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/styles.css`
  Responsibility: collapse the Inquiry layout to a form-only presentation and style the footer copyright line.
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/script.js`
  Responsibility: initialize the footer year and preserve the existing inquiry and reveal behavior.
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`
  Responsibility: add regression coverage for the form-only Inquiry section, footer year placeholder structure, and year initialization behavior.
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/package.json`
  Responsibility: add a preview build script.
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/build-preview.mjs`
  Responsibility: create a clean `dist/` directory with only site assets required for deployment.
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/dist/`
  Responsibility: generated deployment output for hosting providers.
- Optional create only if GitHub Pages fallback is needed: `C:/Users/User/Desktop/Codex/Elaine Website/.gitignore`
  Responsibility: keep `node_modules/`, `dist/`, and local artifacts out of the fallback repo.

### Task 1: Simplify Inquiry and add footer-year behavior

**Files:**
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/index.html`
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/styles.css`
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/script.js`
- Test: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`

- [ ] **Step 1: Write the failing regression tests**

Add these tests to `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`:

```js
test('renders the Inquiry section as intro plus form only', () => {
  const document = loadDocument();
  const layout = document.querySelector('#inquiry > .inquiry-layout');
  const children = Array.from(layout.children);

  expect(children).toHaveLength(2);
  expect(children[0].classList.contains('inquiry-intro')).toBe(true);
  expect(children[1].matches('form#inquiry-form.inquiry-form')).toBe(true);
  expect(layout.querySelector('.inquiry-panel')).toBeNull();
  expect(document.querySelector('#email-cta')).toBeNull();
  expect(document.querySelector('#form-feedback')).toBeNull();
});

test('includes footer copyright markup with a year placeholder', () => {
  const document = loadDocument();
  const copyright = document.querySelector('.footer-copyright');
  const year = document.querySelector('#copyright-year');

  expect(copyright.textContent).toContain('The Unbound Mystic');
  expect(copyright.textContent).toContain('All rights reserved.');
  expect(year).not.toBeNull();
});

test('initializeFooterYear writes the current system year', async () => {
  const dom = new JSDOM(loadHtml(), {
    url: 'http://localhost/'
  });

  global.window = dom.window;
  global.document = dom.window.document;

  const RealDate = dom.window.Date;
  class MockDate extends RealDate {
    constructor(...args) {
      super(...(args.length ? args : ['2032-05-01T00:00:00Z']));
    }
    static now() {
      return new RealDate('2032-05-01T00:00:00Z').valueOf();
    }
  }

  global.Date = MockDate;
  dom.window.Date = MockDate;

  const { initializeFooterYear } = await import(`${scriptPath}?footer-year`);
  initializeFooterYear();

  expect(document.querySelector('#copyright-year').textContent).toBe('2032');

  global.Date = RealDate;
});
```

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `node .\node_modules\vitest\vitest.mjs run tests\site.test.js --testNamePattern "Inquiry section as intro plus form only|footer copyright markup|initializeFooterYear writes the current system year"`

Expected: `FAIL` because the Inquiry panel still exists, the footer copyright structure does not exist, and `initializeFooterYear` is not exported yet.

- [ ] **Step 3: Write the minimal HTML changes**

Update `C:/Users/User/Desktop/Codex/Elaine Website/index.html` to remove the side panel and add the copyright structure:

```html
<section id="inquiry" class="inquiry reveal">
  <div class="inquiry-layout">
    <div class="section-heading inquiry-intro">
      <p class="section-kicker">Begin the conversation</p>
      <h2>Tell me what you are seeking, and I will meet the question with care.</h2>
      <p>
        Complete the form below to prepare your inquiry email. You will be
        taken to your email app with the details already organized.
      </p>
    </div>
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
  </div>
</section>
```

```html
<footer class="footer">
  <p class="footer-brand">The Unbound Mystic</p>
  <p class="footer-copy">
    Tarot guidance for clarity, timing, and sacred self-trust.
  </p>
  <p class="footer-copyright">
    &copy; <span id="copyright-year">2026</span> The Unbound Mystic. All rights reserved.
  </p>
</footer>
```

- [ ] **Step 4: Write the minimal CSS changes**

Update `C:/Users/User/Desktop/Codex/Elaine Website/styles.css` so the Inquiry section is form-only and the footer copyright line is styled:

```css
.inquiry-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
}

.inquiry-form {
  max-width: 52rem;
}

.footer-copyright {
  margin-top: 0.75rem;
  font-size: 0.92rem;
  color: var(--muted);
}
```

Remove selectors that only exist for the deleted side panel:

```css
.inquiry-panel-label {
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
```

```css
.inquiry-panel p
```

```css
.inquiry-panel
```

```css
.email-cta {
  width: 100%;
}
```

Also remove `.inquiry-panel` from any shared grouped selector lists that only applied borders, radius, or backgrounds to the deleted card.

- [ ] **Step 5: Write the minimal JavaScript changes**

Update `C:/Users/User/Desktop/Codex/Elaine Website/script.js` to support the footer year while preserving existing behavior:

```js
export function initializeFooterYear() {
  const yearElement = document.querySelector('#copyright-year');

  if (!yearElement) {
    return;
  }

  yearElement.textContent = String(new Date().getFullYear());
}
```

Keep the inquiry logic resilient after the side panel removal by leaving the early return guard in place and calling the footer initializer from the document bootstrap:

```js
if (typeof document !== 'undefined') {
  initializeInquiryForm();
  initializeFooterYear();
  initializeReveals();
}
```

- [ ] **Step 6: Run the focused tests to verify they pass**

Run: `node .\node_modules\vitest\vitest.mjs run tests\site.test.js --testNamePattern "Inquiry section as intro plus form only|footer copyright markup|initializeFooterYear writes the current system year"`

Expected: `PASS`

- [ ] **Step 7: Run the full test suite**

Run: `node .\node_modules\vitest\vitest.mjs run`

Expected: `PASS` with all tests green, including the existing inquiry mailto behavior.

- [ ] **Step 8: Record completion instead of committing**

Do not run `git commit`. This workspace is not currently a git repository.

### Task 2: Build a clean deployable static output

**Files:**
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`
- Modify: `C:/Users/User/Desktop/Codex/Elaine Website/package.json`
- Create: `C:/Users/User/Desktop/Codex/Elaine Website/build-preview.mjs`
- Test: `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`

- [ ] **Step 1: Write the failing deployment-output test**

Add this test to `C:/Users/User/Desktop/Codex/Elaine Website/tests/site.test.js`:

```js
test('package.json exposes a preview build script', async () => {
  const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));

  expect(packageJson.scripts['build:preview']).toBe('node build-preview.mjs');
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node .\node_modules\vitest\vitest.mjs run tests\site.test.js --testNamePattern "package.json exposes a preview build script"`

Expected: `FAIL` because the script does not exist yet.

- [ ] **Step 3: Add the preview build script entry**

Update `C:/Users/User/Desktop/Codex/Elaine Website/package.json` so `scripts` becomes:

```json
"scripts": {
  "test": "vitest run",
  "build:preview": "node build-preview.mjs"
}
```

- [ ] **Step 4: Create the static packaging script**

Create `C:/Users/User/Desktop/Codex/Elaine Website/build-preview.mjs` with this content:

```js
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('.');
const dist = resolve(root, 'dist');
const filesToCopy = [
  'index.html',
  'styles.css',
  'script.js',
  'guidance-symbolic.webp',
  'IMG-20260820-WA0064.jpg',
  'IMG-20260820-WA0065.jpg'
];

if (existsSync(dist)) {
  rmSync(dist, { recursive: true, force: true });
}

mkdirSync(dist, { recursive: true });

for (const file of filesToCopy) {
  cpSync(resolve(root, file), resolve(dist, file));
}

console.log(`Preview build created at ${dist}`);
```

- [ ] **Step 5: Run the focused test to verify it passes**

Run: `node .\node_modules\vitest\vitest.mjs run tests\site.test.js --testNamePattern "package.json exposes a preview build script"`

Expected: `PASS`

- [ ] **Step 6: Build the deployment output**

Run: `npm run build:preview`

Expected: output containing `Preview build created at C:\Users\User\Desktop\Codex\Elaine Website\dist` and a populated `dist\` directory.

- [ ] **Step 7: Verify the dist contents**

Run: `Get-ChildItem .\dist | Select-Object Name | Sort-Object Name`

Expected list:

```text
guidance-symbolic.webp
IMG-20260820-WA0064.jpg
IMG-20260820-WA0065.jpg
index.html
script.js
styles.css
```

- [ ] **Step 8: Run the full test suite again**

Run: `node .\node_modules\vitest\vitest.mjs run`

Expected: `PASS`

### Task 3: Deploy in the approved host order and capture the review URL

**Files:**
- Modify: none unless GitHub Pages fallback requires `.gitignore`
- Create only if needed: `C:/Users/User/Desktop/Codex/Elaine Website/.gitignore`
- Use built output: `C:/Users/User/Desktop/Codex/Elaine Website/dist`

- [ ] **Step 1: Rebuild the final deployment output**

Run: `npm run build:preview`

Expected: `Preview build created at C:\Users\User\Desktop\Codex\Elaine Website\dist`

- [ ] **Step 2: Try Vercel first**

Run: `npx vercel@latest whoami`

Expected success path: prints the authenticated Vercel account name.

If that succeeds, run:

```powershell
npx vercel@latest deploy .\dist --prod --yes
```

Expected success path: output includes a public `https://<deployment-name>.vercel.app` production URL. Record that URL and stop.

If `whoami` or deploy fails due to missing login, missing team access, or an interactive auth block, proceed to Step 3 without changing site code.

- [ ] **Step 3: Try the first free fallback, Netlify**

Run: `npx netlify-cli@latest status`

Expected success path: prints the logged-in Netlify account state.

If that succeeds, run:

```powershell
npx netlify-cli@latest deploy --dir=.\dist --prod
```

Expected success path: output includes the production site URL. Record that URL and stop.

If Netlify fails because CLI auth is unavailable or the deploy cannot complete, proceed to Step 4.

- [ ] **Step 4: Try the other free fallback, Cloudflare Pages**

Run: `npx wrangler@latest whoami`

Expected success path: prints the authenticated Cloudflare account.

If that succeeds, run:

```powershell
npx wrangler@latest pages project create the-unbound-mystic-review
npx wrangler@latest pages deploy .\dist --project-name the-unbound-mystic-review
```

Expected success path: output includes the public `pages.dev` URL. Record that URL and stop.

If Cloudflare auth or deploy fails, proceed to Step 5.

- [ ] **Step 5: Try GitHub Pages only if the earlier hosts failed**

First verify GitHub CLI auth:

```powershell
gh --version
gh auth status
```

Expected success path: GitHub CLI is installed and authenticated.

If authenticated, create `.gitignore` with:

```gitignore
node_modules/
dist/
.playwright-cli/
```

Then initialize the repo and publish:

```powershell
git init
git branch -M main
git add .
git commit -m "Initial client review site"
gh repo create the-unbound-mystic-review --public --source=. --remote=origin --push
npx gh-pages@latest -d dist
```

Expected success path: `gh-pages` outputs the published `gh-pages` branch push, and the site becomes available at:

```text
https://<github-username>.github.io/the-unbound-mystic-review/
```

If GitHub CLI is unavailable or unauthenticated, record the blocker and stop.

- [ ] **Step 6: Verify the public deployment**

Once any host returns a public URL, run an HTTP check against it:

```powershell
(Invoke-WebRequest -UseBasicParsing "<PUBLIC_URL>").StatusCode
```

Expected: `200`

- [ ] **Step 7: Report the deployment result**

If any host succeeded, report:
- the chosen host
- the public review URL
- any host-specific decisions made along the way

If all hosts failed, report the exact first blocking error for each attempted host:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
