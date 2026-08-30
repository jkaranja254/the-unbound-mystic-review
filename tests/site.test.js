import { readFileSync } from 'node:fs';
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { JSDOM } from 'jsdom';

const htmlPath = resolve(process.cwd(), 'index.html');
const scriptPath = resolve(process.cwd(), 'script.js');
const stylesPath = resolve(process.cwd(), 'styles.css');
const packageJsonPath = resolve(process.cwd(), 'package.json');
const buildPreviewPath = resolve(process.cwd(), 'build-preview.mjs');
const distPath = resolve(process.cwd(), 'dist');

function loadHtml() {
  return readFileSync(htmlPath, 'utf8');
}

function loadStyles() {
  return readFileSync(stylesPath, 'utf8');
}

function loadPackageJson() {
  return JSON.parse(readFileSync(packageJsonPath, 'utf8'));
}

function loadDocument() {
  return new JSDOM(loadHtml(), {
    url: 'http://localhost/'
  }).window.document;
}

function loadStyleRules() {
  const dom = new JSDOM(`<style>${loadStyles()}</style>`);
  return Array.from(dom.window.document.styleSheets[0].cssRules);
}

function getStyleValue(style, property) {
  const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  return style.getPropertyValue(property) || style[camelCaseProperty] || '';
}

function findStyleRule(rules, selector, property) {
  return Array.from(rules).find(
    (rule) =>
      rule.type === 1 &&
      rule.selectorText.split(',').map((item) => item.trim()).includes(selector) &&
      (!property || getStyleValue(rule.style, property))
  );
}

function findMediaRule(rules, condition) {
  return rules.find(
    (rule) => rule.type === 4 && rule.conditionText === condition
  );
}

describe('The Unbound Mystic landing page', () => {
  beforeEach(() => {
    delete global.window;
    delete global.document;
  });

  test('includes the major conversion sections', () => {
    const sectionIds = Array.from(loadDocument().querySelectorAll('main > section')).map(
      (section) => section.id
    );

    expect(sectionIds).toEqual([
      'hero',
      'intro',
      'services',
      'guidance',
      'trust',
      'atmosphere',
      'inquiry'
    ]);
  });

  test('includes the approved services and pricing anchors', () => {
    const servicesText = loadDocument().querySelector('#services').textContent;

    expect(servicesText).toContain('YES/NO Questions');
    expect(servicesText).toContain('3-Month Forecast');
    expect(servicesText).toContain('Love Reading');
    expect(servicesText).toContain('Money/Career Reading');
    expect(servicesText).toContain('Deep Truth & Shadow Work');
    expect(servicesText).toContain('$40');
    expect(servicesText).toContain('$60');
    expect(servicesText).toContain('$80');
    expect(servicesText).toContain('$100');
    expect(servicesText).toContain('$140');
    expect(servicesText).toContain('$200');
  });

  test('includes the editorial guidance and trust sections', () => {
    const document = loadDocument();

    expect(document.querySelector('#guidance').textContent).toContain('Choose Your Guidance');
    expect(document.querySelector('#trust').textContent).toContain('Why Seek Guidance Here');
    expect(document.body.textContent).toContain('The Unbound Mystic');
    expect(document.body.textContent).toContain('divine feminine');
  });

  test('removes luxury language from the HTML', () => {
    expect(loadDocument().body.textContent).not.toMatch(/luxury/i);
  });

  test('nests the approved service cards in their respective rows', () => {
    const document = loadDocument();
    const shell = document.querySelector('#services > .services-shell');
    const primaryRow = shell.children[1];
    const secondaryRow = shell.children[2];

    expect(primaryRow.classList.contains('service-row-primary')).toBe(true);
    expect(Array.from(primaryRow.children).map((card) => card.id)).toEqual([
      'service-yes-no',
      'service-forecast',
      'service-love'
    ]);
    expect(secondaryRow.classList.contains('service-row-secondary')).toBe(true);
    expect(Array.from(secondaryRow.children).map((card) => card.id)).toEqual([
      'service-money',
      'service-shadow'
    ]);
    expect(Array.from(shell.querySelectorAll('.service-card')).every(
      (card) => card.tagName === 'ARTICLE'
    )).toBe(true);
  });

  test('uses the approved Guidance figure and optimized image markup', () => {
    const document = loadDocument();
    const layout = document.querySelector('#guidance > .guidance-layout');
    const figure = Array.from(layout.children).find((child) =>
      child.classList.contains('guidance-visual')
    );
    const image = figure.firstElementChild;

    expect(figure.tagName).toBe('FIGURE');
    expect(image.tagName).toBe('IMG');
    expect(figure.children).toHaveLength(1);
    expect(image.getAttribute('src')).toBe('guidance-symbolic.webp');
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(image.getAttribute('alt')).toBe(
      'Celestial tarot artwork symbolizing intuitive guidance and spiritual clarity.'
    );
  });

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

  test('includes a mailto fallback on the inquiry form', () => {
    const form = loadDocument().querySelector('#inquiry-form');

    expect(form.getAttribute('action')).toBe('mailto:hello@theunboundmystic.com');
    expect(form.getAttribute('method')).toBe('post');
    expect(form.getAttribute('enctype')).toBe('text/plain');
  });

  test('includes footer copyright markup with a year placeholder', () => {
    const document = loadDocument();
    const copyright = document.querySelector('.footer-copyright');
    const year = document.querySelector('#copyright-year');

    expect(copyright).not.toBeNull();
    expect(year).not.toBeNull();
    expect(copyright.textContent).toContain('The Unbound Mystic');
    expect(copyright.textContent).toContain('All rights reserved.');
  });

  test('includes the refreshed layout and typography CSS hooks', () => {
    const rules = loadStyleRules();

    expect(findStyleRule(rules, ':root').style.getPropertyValue('--section-heading-size')).toBe(
      'clamp(2.55rem, 5vw, 4.15rem)'
    );
    expect(getStyleValue(findStyleRule(rules, '.section-kicker', 'font-size').style, 'font-size')).toBe('14pt');
    expect(getStyleValue(findStyleRule(rules, '.eyebrow', 'font-size').style, 'font-size')).toBe('0.72rem');
    expect(getStyleValue(findStyleRule(rules, '.service-tag', 'font-size').style, 'font-size')).toBe('14pt');
    expect(getStyleValue(findStyleRule(rules, '.guidance-label', 'font-size').style, 'font-size')).toBe('14pt');
    expect(findStyleRule(rules, '.services-shell')).toBeDefined();
    expect(getStyleValue(
      findStyleRule(rules, '.service-row-primary', 'grid-template-columns').style,
      'grid-template-columns'
    )).toBe(
      'repeat(3, minmax(0, 1fr))'
    );
    expect(getStyleValue(
      findStyleRule(rules, '.service-row-secondary', 'grid-template-columns').style,
      'grid-template-columns'
    )).toBe(
      'repeat(2, minmax(0, 1fr))'
    );
    expect(findStyleRule(rules, '.guidance-layout')).toBeDefined();
    expect(findStyleRule(rules, '.guidance-overview')).toBeDefined();
    expect(findStyleRule(rules, '.guidance-visual')).toBeDefined();
    expect(getStyleValue(findStyleRule(rules, '.guidance-card strong').style, 'font-size')).toBe('2rem');

    const inquiryIntro = findStyleRule(rules, '.inquiry-intro').style;
    expect(getStyleValue(inquiryIntro, 'grid-column')).toBe('1 / -1');
    expect(getStyleValue(inquiryIntro, 'max-width')).toBe('none');
    expect(getStyleValue(inquiryIntro, 'width')).toBe('100%');
  });

  test('removes deleted inquiry panel selectors from the stylesheet', () => {
    const rules = loadStyleRules();

    expect(findStyleRule(rules, '.inquiry-panel')).toBeUndefined();
    expect(findStyleRule(rules, '.inquiry-panel-label')).toBeUndefined();
    expect(findStyleRule(rules, '.inquiry-panel h3')).toBeUndefined();
  });

  test('keeps Guidance balanced until its dedicated stacked breakpoint', () => {
    const rules = loadStyleRules();
    const mediumLayout = findMediaRule(rules, '(max-width: 1100px)');
    const guidanceBreakpoint = findMediaRule(rules, '(max-width: 900px)');

    expect(findStyleRule(mediumLayout.cssRules, '.guidance-layout')).toBeUndefined();
    expect(guidanceBreakpoint).toBeDefined();

    const stackedLayout = findStyleRule(guidanceBreakpoint.cssRules, '.guidance-layout').style;
    const stackedVisual = findStyleRule(guidanceBreakpoint.cssRules, '.guidance-visual').style;
    const stackedImage = findStyleRule(guidanceBreakpoint.cssRules, '.guidance-visual img').style;

    expect(getStyleValue(stackedLayout, 'grid-template-columns')).toBe('1fr');
    expect(getStyleValue(stackedVisual, 'position')).toBe('static');
    expect(getStyleValue(stackedVisual, 'width')).toBe('100%');
    expect(getStyleValue(stackedVisual, 'max-width')).toBe('36rem');
    expect(getStyleValue(stackedVisual, 'justify-self')).toBe('center');
    expect(getStyleValue(stackedImage, 'aspect-ratio')).toBe('4 / 3');
  });

  test('keeps reveal sections visible until JavaScript enhancement runs', () => {
    const rules = loadStyleRules();
    const revealRule = findStyleRule(rules, '.reveal');
    const revealReadyRule = findStyleRule(rules, '.reveal-ready');
    const revealVisibleRule = findStyleRule(rules, '.reveal-ready.is-visible');

    expect(revealRule).toBeUndefined();
    expect(revealReadyRule).toBeDefined();
    expect(revealVisibleRule).toBeDefined();
    expect(getStyleValue(revealReadyRule.style, 'opacity')).toBe('0');
    expect(getStyleValue(revealVisibleRule.style, 'opacity')).toBe('1');
  });

  test('buildInquiryMailto encodes the inquiry email payload', async () => {
    const { buildInquiryMailto } = await import(scriptPath);

    const href = buildInquiryMailto({
      name: 'Ava',
      email: 'ava@example.com',
      service: 'Love Reading',
      focus: 'Need clarity about a relationship',
      timing: 'This month'
    });

    expect(href).toContain('mailto:hello@theunboundmystic.com');
    expect(href).toContain('Love%20Reading');
    expect(href).toContain('Need%20clarity%20about%20a%20relationship');
    expect(href).toContain('This%20month');
  });

  test('initializeFooterYear writes the current system year using a mocked Date', async () => {
    const dom = new JSDOM(loadHtml(), {
      url: 'http://localhost/'
    });

    global.window = dom.window;
    global.document = dom.window.document;

    const realGlobalDate = global.Date;
    const realWindowDate = dom.window.Date;

    class MockDate extends realWindowDate {
      constructor(...args) {
        super(...(args.length ? args : ['2032-05-01T00:00:00Z']));
      }

      static now() {
        return new realWindowDate('2032-05-01T00:00:00Z').valueOf();
      }
    }

    global.Date = MockDate;
    dom.window.Date = MockDate;

    try {
      const { initializeFooterYear } = await import(`${scriptPath}?footer-year`);
      initializeFooterYear();

      expect(document.querySelector('#copyright-year').textContent).toBe('2032');
    } finally {
      global.Date = realGlobalDate;
      dom.window.Date = realWindowDate;
    }
  });

  test('submitting the inquiry form opens the prepared inquiry email', async () => {
    const dom = new JSDOM(loadHtml(), {
      url: 'http://localhost/'
    });

    global.window = dom.window;
    global.document = dom.window.document;
    const openSpy = vi.spyOn(dom.window, 'open').mockImplementation(() => null);

    const { buildInquiryMailto } = await import(`${scriptPath}?dom`);

    document.querySelector('#name').value = 'Ava';
    document.querySelector('#email').value = 'ava@example.com';
    document.querySelector('#service').value = 'Love Reading';
    document.querySelector('#focus').value = 'Need clarity about a relationship';
    document.querySelector('#timing').value = 'This month';

    document.querySelector('#inquiry-form').dispatchEvent(
      new dom.window.Event('submit', { bubbles: true, cancelable: true })
    );

    expect(openSpy).toHaveBeenCalledWith(
      buildInquiryMailto({
        name: 'Ava',
        email: 'ava@example.com',
        service: 'Love Reading',
        focus: 'Need clarity about a relationship',
        timing: 'This month'
      }),
      '_self'
    );

    openSpy.mockRestore();
  });

  test('invalid inquiry submission does not open an email draft', async () => {
    const dom = new JSDOM(loadHtml(), {
      url: 'http://localhost/'
    });

    global.window = dom.window;
    global.document = dom.window.document;

    const form = document.querySelector('#inquiry-form');
    const openSpy = vi.spyOn(dom.window, 'open').mockImplementation(() => null);
    const reportValiditySpy = vi.spyOn(form, 'reportValidity');
    const submitEvent = new dom.window.Event('submit', { bubbles: true, cancelable: true });

    await import(`${scriptPath}?invalid-submit`);

    form.dispatchEvent(submitEvent);

    expect(form.checkValidity()).toBe(false);
    expect(reportValiditySpy).toHaveBeenCalledTimes(1);
    expect(openSpy).not.toHaveBeenCalled();
    expect(submitEvent.defaultPrevented).toBe(false);

    reportValiditySpy.mockRestore();
    openSpy.mockRestore();
  });

  test('exposes the preview build script in package.json', () => {
    expect(loadPackageJson().scripts['build:preview']).toBe('node build-preview.mjs');
  });

  test('preview build recreates dist with only the deployable site assets', async () => {
    const expectedFiles = [
      'guidance-symbolic.webp',
      'IMG-20260820-WA0064.jpg',
      'IMG-20260820-WA0065.jpg',
      'index.html',
      'script.js',
      'styles.css'
    ];

    await mkdir(resolve(distPath, 'junk-folder'), { recursive: true });
    await writeFile(resolve(distPath, 'junk.txt'), 'junk', 'utf8');
    await writeFile(resolve(distPath, 'junk-folder', 'nested.txt'), 'junk', 'utf8');

    const output = execFileSync(process.execPath, [buildPreviewPath], {
      cwd: process.cwd(),
      encoding: 'utf8'
    });

    expect((await stat(distPath)).isDirectory()).toBe(true);
    expect(output.trim()).toBe(distPath);
    expect(await readdir(distPath)).toEqual(expectedFiles);
    await expect(stat(resolve(distPath, 'junk.txt'))).rejects.toThrow();
    await expect(stat(resolve(distPath, 'junk-folder'))).rejects.toThrow();
  });
});
