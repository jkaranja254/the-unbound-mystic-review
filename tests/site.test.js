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
const legalPagePaths = [
  resolve(process.cwd(), 'disclaimer.html'),
  resolve(process.cwd(), 'privacy-policy.html'),
  resolve(process.cwd(), 'terms-of-service.html')
];

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

  test('uses the streamlined guidance and trust section copy', () => {
    const document = loadDocument();
    const bodyText = document.body.textContent;

    expect(document.querySelector('#guidance').textContent).toContain('Choose Your Guidance');
    expect(document.querySelector('#trust').textContent).toContain('Why Seek Guidance Here');
    expect(document.querySelector('#trust .section-kicker')).toBeNull();
    expect(document.querySelector('#trust h2').textContent).toBe('Why Seek Guidance Here');
    expect(document.querySelector('#trust .trust-visual img').getAttribute('src')).toBe(
      'IMG-20260820-WA0064.jpg'
    );
    expect(document.querySelector('#atmosphere')).toBeNull();
    expect(bodyText).not.toContain('Inspired by Astrala');
    expect(bodyText).not.toContain('cinematic tarot experience');
  });

  test('uses Inquiry in the primary navigation and removes the hero text inset', () => {
    const document = loadDocument();

    expect(document.querySelector('.topnav a[href="#inquiry"]').textContent).toBe('Inquiry');
    expect(document.querySelector('.hero-visual .floating-card')).toBeNull();
    expect(document.body.textContent).not.toContain('A sacred inquiry awaits');
  });

  test('includes a logo-based loading overlay with a percentage status', () => {
    const document = loadDocument();
    const loader = document.querySelector('#site-loader');

    expect(loader).not.toBeNull();
    expect(loader.getAttribute('role')).toBe('status');
    expect(loader.getAttribute('aria-live')).toBe('polite');
    expect(loader.querySelector('img').getAttribute('src')).toBe('unbound-mystic-logo.png');
    expect(loader.querySelector('#loading-percentage').textContent).toBe('0');
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

  test('renders the approved logo lockups in the header and footer', () => {
    const document = loadDocument();
    const headerBrand = document.querySelector('header .brand-mark');
    const headerLogo = headerBrand.querySelector('img.brand-logo');
    const headerText = headerBrand.querySelector('.brand-wordmark');
    const footerBrand = document.querySelector('.footer-brand');
    const footerLogo = footerBrand.querySelector('img.brand-logo');
    const footerText = footerBrand.querySelector('.footer-brand-text');

    expect(headerLogo).not.toBeNull();
    expect(headerLogo.getAttribute('src')).toBe('unbound-mystic-logo.png');
    expect(headerLogo.getAttribute('alt')).toBe('The Unbound Mystic logo');
    expect(headerBrand.firstElementChild).toBe(headerLogo);
    expect(headerText.textContent).toBe('THE UNBOUND MYSTIC');

    expect(footerLogo).not.toBeNull();
    expect(footerLogo.getAttribute('src')).toBe('unbound-mystic-logo.png');
    expect(footerLogo.getAttribute('alt')).toBe('The Unbound Mystic logo');
    expect(footerBrand.firstElementChild).toBe(footerLogo);
    expect(footerText.textContent).toBe('THE UNBOUND MYSTIC');
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

  test('uses the approved footer line and legal links in new windows', () => {
    const document = loadDocument();
    const footer = document.querySelector('.footer');
    const links = Array.from(footer.querySelectorAll('.footer-legal a'));

    expect(footer.querySelector('.footer-copy').textContent.trim()).toBe(
      'Intuitive. Magnetic. Powerful. Divine Feminine.'
    );
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      'disclaimer.html',
      'privacy-policy.html',
      'terms-of-service.html'
    ]);
    expect(links.every((link) => link.getAttribute('target') === '_blank')).toBe(true);
    expect(links.every((link) => link.getAttribute('rel') === 'noopener noreferrer')).toBe(true);
  });

  test('includes standalone legal documents', () => {
    legalPagePaths.forEach((path) => {
      const document = new JSDOM(readFileSync(path, 'utf8')).window.document;
      const links = Array.from(document.querySelectorAll('.footer-legal a'));

      expect(document.body.textContent).toContain('The Unbound Mystic');
      expect(links).toHaveLength(3);
      expect(links.every((link) => link.getAttribute('target') === '_blank')).toBe(true);
    });
  });

  test('provides detailed Texas and U.S. consumer legal information', () => {
    const disclaimer = readFileSync(resolve(process.cwd(), 'disclaimer.html'), 'utf8');
    const privacy = readFileSync(resolve(process.cwd(), 'privacy-policy.html'), 'utf8');
    const terms = readFileSync(resolve(process.cwd(), 'terms-of-service.html'), 'utf8');

    expect(disclaimer).toContain('not medical, mental health, legal, financial, investment');
    expect(disclaimer).toContain('988');
    expect(privacy).toContain('Texas Data Privacy and Security Act');
    expect(privacy).toContain('California Privacy Rights');
    expect(privacy).toContain('Privacy Appeal');
    expect(terms).toContain('18 years of age');
    expect(terms).toContain('Refunds and Cancellations');
    expect(terms).toContain('Dallas, Texas');
    expect(terms).toContain('non-waivable consumer rights');
  });

  test('includes the refreshed layout and typography CSS hooks', () => {
    const rules = loadStyleRules();

    expect(findStyleRule(rules, ':root').style.getPropertyValue('--section-heading-size')).toBe(
      'clamp(2.55rem, 5vw, 4.15rem)'
    );
    expect(getStyleValue(findStyleRule(rules, '.section-kicker', 'font-size').style, 'font-size')).toBe('14pt');
    expect(getStyleValue(findStyleRule(rules, '.eyebrow', 'font-size').style, 'font-size')).toBe('14pt');
    expect(getStyleValue(findStyleRule(rules, '.service-tag', 'font-size').style, 'font-size')).toBe('14pt');
    expect(getStyleValue(findStyleRule(rules, '.guidance-label', 'font-size').style, 'font-size')).toBe('14pt');
    expect(getStyleValue(findStyleRule(rules, '.hero-copy h1', 'font-size').style, 'font-size')).toBe(
      'calc(clamp(3.2rem, 7vw, 6.2rem) - 4pt)'
    );
    expect(getStyleValue(findStyleRule(rules, '.brand-mark', 'gap').style, 'gap')).toBe('0.75rem');
    expect(getStyleValue(findStyleRule(rules, '.brand-mark', 'padding-left').style, 'padding-left')).toBe('0.4rem');
    expect(getStyleValue(findStyleRule(rules, '.topnav a', 'font-family').style, 'font-family')).toBe(
      '"Manrope", sans-serif'
    );
    expect(getStyleValue(findStyleRule(rules, '.topnav a', 'font-size').style, 'font-size')).toBe('0.86rem');
    expect(getStyleValue(findStyleRule(rules, '.topnav a', 'font-weight').style, 'font-weight')).toBe('700');
    expect(getStyleValue(findStyleRule(rules, '.topnav a', 'color').style, 'color')).toBe('var(--gold-soft)');
    expect(getStyleValue(findStyleRule(rules, '.topnav', 'padding-right').style, 'padding-right')).toBe('0.9rem');
    expect(getStyleValue(findStyleRule(rules, '.footer-brand', 'flex-direction').style, 'flex-direction')).toBe('column');

    const headerWordmark = findStyleRule(rules, '.brand-wordmark', 'font-family').style;
    const footerWordmark = findStyleRule(rules, '.footer-brand-text', 'font-family').style;
    expect(getStyleValue(headerWordmark, 'font-family')).toBe('"Cormorant Garamond", serif');
    expect(getStyleValue(footerWordmark, 'font-family')).toBe('"Cormorant Garamond", serif');
    expect(getStyleValue(headerWordmark, 'font-size')).toBe('1.2rem');
    expect(getStyleValue(footerWordmark, 'font-size')).toBe('1.2rem');
    expect(getStyleValue(headerWordmark, 'font-weight')).toBe('700');
    expect(getStyleValue(footerWordmark, 'font-weight')).toBe('700');

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
    expect(getStyleValue(inquiryIntro, 'text-align')).toBe('center');

    const inquiryForm = findStyleRule(rules, '.inquiry-form', 'justify-self').style;
    expect(getStyleValue(inquiryForm, 'justify-self')).toBe('center');

    const trust = findStyleRule(rules, '.trust').style;
    const trustVisual = findStyleRule(rules, '.trust-visual').style;
    const trustImage = findStyleRule(rules, '.trust-visual img').style;
    const trustPoints = findStyleRule(rules, '.trust-points').style;

    expect(getStyleValue(trust, 'grid-template-columns')).toBe(
      'minmax(0, 1.7fr) minmax(18rem, 1fr)'
    );
    expect(getStyleValue(trustVisual, 'justify-self')).toBe('stretch');
    expect(getStyleValue(trustVisual, 'width')).toBe('100%');
    expect(getStyleValue(trustVisual, 'grid-column')).toBe('1');
    expect(getStyleValue(trustImage, 'aspect-ratio')).toBe('3 / 2');
    expect(getStyleValue(trustPoints, 'grid-column')).toBe('2');
    expect(getStyleValue(trustPoints, 'grid-row')).toBe('1 / span 2');
    expect(getStyleValue(trustPoints, 'grid-template-columns')).toBe('1fr');
  });

  test('gives cards a gold hover and keyboard-focus glow', () => {
    const rules = loadStyleRules();
    const hoverRule = findStyleRule(rules, '.service-card:hover', 'border-color');
    const focusRule = findStyleRule(rules, '.guidance-card:focus-visible', 'box-shadow');

    expect(hoverRule).toBeDefined();
    expect(getStyleValue(hoverRule.style, 'border-color')).toBe('var(--gold-soft)');
    expect(focusRule).toBeDefined();
    expect(getStyleValue(focusRule.style, 'box-shadow')).toContain('rgba(216, 176, 106, 0.38)');
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
    const compactBreakpoint = findMediaRule(rules, '(max-width: 760px)');

    expect(findStyleRule(mediumLayout.cssRules, '.guidance-layout')).toBeUndefined();
    expect(guidanceBreakpoint).toBeDefined();
    expect(compactBreakpoint).toBeDefined();

    const stackedLayout = findStyleRule(guidanceBreakpoint.cssRules, '.guidance-layout').style;
    const stackedVisual = findStyleRule(guidanceBreakpoint.cssRules, '.guidance-visual').style;
    const stackedImage = findStyleRule(guidanceBreakpoint.cssRules, '.guidance-visual img').style;
    const compactHero = findStyleRule(compactBreakpoint.cssRules, '.hero-copy h1', 'font-size').style;

    expect(getStyleValue(stackedLayout, 'grid-template-columns')).toBe('1fr');
    expect(getStyleValue(stackedVisual, 'position')).toBe('static');
    expect(getStyleValue(stackedVisual, 'width')).toBe('100%');
    expect(getStyleValue(stackedVisual, 'max-width')).toBe('36rem');
    expect(getStyleValue(stackedVisual, 'justify-self')).toBe('center');
    expect(getStyleValue(stackedImage, 'aspect-ratio')).toBe('4 / 3');
    expect(getStyleValue(compactHero, 'font-size')).toBe('calc(clamp(2.7rem, 14vw, 4.4rem) - 4pt)');
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

  test('buildInquiryMailto encodes every selected inquiry service', async () => {
    const { buildInquiryMailto } = await import(`${scriptPath}?multiple-services`);

    const href = buildInquiryMailto({
      name: 'Ava',
      email: 'ava@example.com',
      services: ['Love Reading', '3-Month Forecast'],
      focus: 'Need clarity about a relationship',
      timing: 'This month'
    });

    expect(href).toContain('mailto:hello@theunboundmystic.com');
    expect(href).toContain('Love%20Reading');
    expect(href).toContain('3-Month%20Forecast');
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

  test('completes and dismisses the site loader after the window load event', async () => {
    const dom = new JSDOM(loadHtml(), {
      url: 'http://localhost/'
    });

    global.window = dom.window;
    global.document = dom.window.document;
    const { initializeSiteLoader } = await import(`${scriptPath}?site-loader`);

    initializeSiteLoader();
    dom.window.dispatchEvent(new dom.window.Event('load'));

    expect(document.querySelector('#loading-percentage').textContent).toBe('100');
    expect(document.querySelector('#site-loader').classList.contains('is-complete')).toBe(true);
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
    document.querySelector('input[name="services"][value="Love Reading"]').checked = true;
    document.querySelector('#focus').value = 'Need clarity about a relationship';
    document.querySelector('#timing').value = 'This month';

    document.querySelector('#inquiry-form').dispatchEvent(
      new dom.window.Event('submit', { bubbles: true, cancelable: true })
    );

    expect(openSpy).toHaveBeenCalledWith(
      buildInquiryMailto({
        name: 'Ava',
        email: 'ava@example.com',
        services: ['Love Reading'],
        focus: 'Need clarity about a relationship',
        timing: 'This month'
      }),
      '_self'
    );

    openSpy.mockRestore();
  });

  test('counts inquiry words and blocks an over-limit submission', async () => {
    const dom = new JSDOM(loadHtml(), {
      url: 'http://localhost/'
    });

    global.window = dom.window;
    global.document = dom.window.document;
    const openSpy = vi.spyOn(dom.window, 'open').mockImplementation(() => null);
    const { countWords, WORD_LIMIT } = await import(`${scriptPath}?word-limit`);
    const form = document.querySelector('#inquiry-form');
    const focus = document.querySelector('#focus');

    expect(WORD_LIMIT).toBe(80);
    expect(countWords('  one\n two   three ')).toBe(3);

    document.querySelector('#name').value = 'Ava';
    document.querySelector('#email').value = 'ava@example.com';
    document.querySelector('input[name="services"][value="Love Reading"]').checked = true;
    focus.value = Array.from({ length: WORD_LIMIT + 1 }, (_, index) => `word${index}`).join(' ');
    focus.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));

    expect(document.querySelector('#focus-counter').textContent).toContain('81 / 80 words');
    expect(focus.validationMessage).toContain('80 words');
    expect(openSpy).not.toHaveBeenCalled();

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
    expect(submitEvent.defaultPrevented).toBe(true);

    reportValiditySpy.mockRestore();
    openSpy.mockRestore();
  });

  test('exposes the preview build script in package.json', () => {
    expect(loadPackageJson().scripts['build:preview']).toBe('node build-preview.mjs');
  });

  test('preview build recreates dist with only the deployable site assets', async () => {
    const expectedFiles = [
      'disclaimer.html',
      'guidance-symbolic.webp',
      'IMG-20260820-WA0064.jpg',
      'IMG-20260820-WA0065.jpg',
      'index.html',
      'privacy-policy.html',
      'script.js',
      'styles.css',
      'terms-of-service.html',
      'unbound-mystic-logo.png'
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
