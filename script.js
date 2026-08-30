const INQUIRY_EMAIL = 'hello@theunboundmystic.com';

export function buildInquiryMailto({ name, email, service, focus, timing }) {
  const subject = encodeURIComponent(`The Unbound Mystic Inquiry: ${service}`);
  const body = encodeURIComponent(
    [
      'Hello,',
      '',
      'I would like to inquire about a reading.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${service}`,
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

  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    event.preventDefault();

    const payload = {
      name: document.querySelector('#name')?.value.trim() ?? '',
      email: document.querySelector('#email')?.value.trim() ?? '',
      service: document.querySelector('#service')?.value ?? '',
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
  initializeReveals();
}
