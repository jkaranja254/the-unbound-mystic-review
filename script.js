const INQUIRY_EMAIL = 'hello@theunboundmystic.com';
export const WORD_LIMIT = 80;
export const LOADER_MINIMUM_DURATION = 2500;

export function countWords(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

export function buildInquiryMailto({ name, email, services = [], focus, timing }) {
  const serviceList = services.join(', ');
  const subject = encodeURIComponent(`The Unbound Mystic Inquiry: ${serviceList}`);
  const body = encodeURIComponent(
    [
      'Hello,',
      '',
      'I would like to inquire about a reading.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${serviceList}`,
      `Focus Area: ${focus}`,
      `Timing / Context: ${timing || 'Not provided'}`,
      '',
      'Thank you.'
    ].join('\n')
  );

  return `mailto:${INQUIRY_EMAIL}?subject=${subject}&body=${body}`;
}

export function initializeInquiryForm() {
  const form = document.querySelector('#inquiry-form');

  if (!form) {
    return;
  }

  const focus = form.querySelector('#focus');
  const counter = form.querySelector('#focus-counter');
  const serviceInputs = Array.from(form.querySelectorAll('input[name="services"]'));

  const updateWordCounter = () => {
    const wordCount = countWords(focus?.value ?? '');
    const isOverLimit = wordCount > WORD_LIMIT;

    if (focus) {
      focus.setCustomValidity(
        isOverLimit ? `Please keep your response to ${WORD_LIMIT} words or fewer.` : ''
      );
    }

    if (counter) {
      counter.textContent = `${wordCount} / ${WORD_LIMIT} words`;
      counter.classList.toggle('is-over-limit', isOverLimit);
    }

    return !isOverLimit;
  };

  const validateServices = () => {
    const hasService = serviceInputs.some((input) => input.checked);

    serviceInputs[0]?.setCustomValidity(hasService ? '' : 'Select at least one service.');
    return hasService;
  };

  focus?.addEventListener('input', updateWordCounter);
  serviceInputs.forEach((input) => input.addEventListener('change', validateServices));
  updateWordCounter();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const hasServices = validateServices();
    const isWithinWordLimit = updateWordCounter();

    if (!hasServices || !isWithinWordLimit || !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    event.preventDefault();

    const payload = {
      name: document.querySelector('#name')?.value.trim() ?? '',
      email: document.querySelector('#email')?.value.trim() ?? '',
      services: serviceInputs.filter((input) => input.checked).map((input) => input.value),
      focus: document.querySelector('#focus')?.value.trim() ?? '',
      timing: document.querySelector('#timing')?.value.trim() ?? ''
    };

    window.open(buildInquiryMailto(payload), '_self');
  });
}

export function initializeFooterYear() {
  const yearElement = document.querySelector('#copyright-year');

  if (!yearElement) {
    return;
  }

  yearElement.textContent = String(new Date().getFullYear());
}

export function initializeSiteLoader() {
  const loader = document.querySelector('#site-loader');

  if (!loader || loader.dataset.initialized === 'true') {
    return;
  }

  const browserWindow = window;
  const percentage = loader.querySelector('#loading-percentage');
  const startedAt = Date.now();
  let progress = 0;
  let timerId;
  let completionTimerId;
  let hasCompleted = false;

  const updateProgress = (value) => {
    progress = value;
    percentage.textContent = String(progress);
  };

  const advanceProgress = () => {
    updateProgress(Math.min(progress + 8, 92));

    if (progress < 92) {
      timerId = browserWindow.setTimeout(advanceProgress, 120);
    }
  };

  const completeLoading = () => {
    if (hasCompleted || completionTimerId !== undefined) {
      return;
    }

    const remainingDuration = Math.max(0, LOADER_MINIMUM_DURATION - (Date.now() - startedAt));
    completionTimerId = browserWindow.setTimeout(() => {
      hasCompleted = true;
      browserWindow.clearTimeout(timerId);
      updateProgress(100);
      loader.classList.add('is-complete');
    }, remainingDuration);
  };

  loader.dataset.initialized = 'true';
  timerId = browserWindow.setTimeout(advanceProgress, 120);

  if (document.readyState === 'complete') {
    completeLoading();
  } else {
    browserWindow.addEventListener('load', completeLoading, { once: true });
  }
}

export function initializeBackToTop() {
  const button = document.querySelector('#back-to-top');

  if (!button || button.dataset.initialized === 'true') {
    return;
  }

  const browserWindow = window;
  const updateVisibility = () => {
    button.classList.toggle('is-visible', browserWindow.scrollY > 500);
  };

  button.dataset.initialized = 'true';
  browserWindow.addEventListener('scroll', updateVisibility, { passive: true });
  button.addEventListener('click', () => {
    const prefersReducedMotion = browserWindow.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    browserWindow.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
  updateVisibility();
}

function initializeReveals() {
  const elements = document.querySelectorAll('.reveal');

  if (!elements.length) {
    return;
  }

  elements.forEach((element) => element.classList.add('reveal-ready'));

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  elements.forEach((element) => observer.observe(element));
}

if (typeof document !== 'undefined') {
  initializeInquiryForm();
  initializeFooterYear();
  initializeSiteLoader();
  initializeBackToTop();
  initializeReveals();
}
