# Content, Form, and Legal Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the landing-page narrative, add accessible card feedback, strengthen the inquiry form, and publish supporting legal pages.

**Architecture:** Keep the site static. `index.html` owns page structure and copy; `styles.css` defines responsive presentation; `script.js` owns form validation, live counters, and mailto composition. Three static legal documents share the site's visual language and footer links.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Vitest, JSDOM, GitHub Pages preview build.

---

### Task 1: Update Page Narrative and Visual Flow

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/site.test.js`

- [ ] Write tests for updated navigation/copy, the removed hero inset, the removed guidance description, and the trust image placement.
- [ ] Run `npm test -- --runInBand` (or the targeted Vitest command) and confirm the tests fail because the old structure remains.
- [ ] Replace `Inquire` with `Inquiry`, remove the requested legacy copy, remove the floating hero inset, and relocate the brand still-life image to the trust section.
- [ ] Add responsive trust-image styling and a shared gold border glow for interactive and content cards.
- [ ] Re-run the targeted tests and then `npm test`.

### Task 2: Upgrade the Inquiry Form

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `script.js`
- Test: `tests/site.test.js`

- [ ] Write failing tests for service checkboxes, an 80-word counter, word-limit validation, and multi-service email composition.
- [ ] Run the focused tests and confirm they fail against the existing select-field implementation.
- [ ] Replace the service select with an accessible checkbox group, add an 80-word live counter, and prevent email-draft opening when no service is selected or the response exceeds the limit.
- [ ] Change inquiry copy to the 3-5 business-day expectation and set the submit button text to `Submit`.
- [ ] Re-run focused tests and then `npm test`.

### Task 3: Publish Footer and Legal Pages

**Files:**
- Modify: `index.html`
- Create: `disclaimer.html`
- Create: `privacy-policy.html`
- Create: `terms-of-service.html`
- Modify: `build-preview.mjs`
- Test: `tests/site.test.js`

- [ ] Write failing tests for footer messaging, new-window legal links, legal-page files, and deploy-build contents.
- [ ] Run the focused tests and confirm they fail because the pages and links do not exist.
- [ ] Add the three focused legal documents, open their footer links in a new window securely, update the footer statement, and include the pages in the preview build.
- [ ] Run `npm test` and `npm run build:preview`; inspect the generated deployable file list.

### Task 4: Review and Deploy

**Files:**
- Review: `index.html`, `styles.css`, `script.js`, `tests/site.test.js`, legal pages, `build-preview.mjs`

- [ ] Review the final diff against every request in this plan.
- [ ] Verify the complete test suite and preview build from a clean working state.
- [ ] Commit the implementation, push `main`, and verify the GitHub Pages URL returns the updated site.
