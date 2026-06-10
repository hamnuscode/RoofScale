/* =========================================================
   Roofing Growth System — landing page behaviour
   ========================================================= */
(function () {
  'use strict';

  /* ---- Where qualified/unqualified leads should be POSTed.
     Replace with your CRM / Zapier / Make webhook endpoint. ---- */
  var WEBHOOK_URL = 'https://example.com/webhook/roofing-audit';

  /* -------------------------------------------------------
     1. Smooth-scroll for in-page CTA links
     ------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      var target = id && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      // move focus to the form section for keyboard/screen-reader users
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* -------------------------------------------------------
     2. Scroll-triggered reveals (one entrance per element)
     ------------------------------------------------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach(function (el) {
    var d = el.getAttribute('data-reveal-delay');
    if (d) el.style.setProperty('--reveal-delay', d);
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------
     3. Video poster -> play (placeholder hook)
     ------------------------------------------------------- */
  var playBtn = document.querySelector('.video__play');
  if (playBtn) {
    playBtn.addEventListener('click', function () {
      // Swap this for your real embed (YouTube/Wistia/Vimeo/<video>).
      console.log('[VSL] play clicked — drop your video embed here.');
    });
  }

  /* -------------------------------------------------------
     4. Qualification form: validation + silent scoring
     ------------------------------------------------------- */
  var form = document.getElementById('audit-form');
  if (!form) return;

  function setError(name, message) {
    var input = form.querySelector('[name="' + name + '"]');
    var slot = form.querySelector('[data-err-for="' + name + '"]');
    if (slot) slot.textContent = message || '';
    // mark single inputs/selects invalid (radios/checkboxes handled at group level)
    if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
      if (input.type !== 'radio' && input.type !== 'checkbox') {
        input.classList.toggle('invalid', !!message);
      }
    }
  }

  function getValue(name) {
    var el = form.elements[name];
    return el ? el.value.trim() : '';
  }

  function getChecked(name) {
    return Array.prototype.slice
      .call(form.querySelectorAll('[name="' + name + '"]:checked'))
      .map(function (el) { return el.value; });
  }

  function validate() {
    var ok = true;
    var firstInvalid = null;

    function fail(name, msg) {
      setError(name, msg);
      if (ok) firstInvalid = form.querySelector('[name="' + name + '"]');
      ok = false;
    }

    // Text fields
    if (!getValue('fullName')) fail('fullName', 'Please enter your full name.');
    else setError('fullName', '');

    if (!getValue('businessName')) fail('businessName', 'Please enter your business name.');
    else setError('businessName', '');

    var phone = getValue('phone');
    var phoneDigits = phone.replace(/[^0-9]/g, '');
    if (!phone) fail('phone', 'Please enter your phone number.');
    else if (phoneDigits.length < 10) fail('phone', 'Enter a valid phone number (at least 10 digits).');
    else setError('phone', '');

    if (!getValue('location')) fail('location', 'Please enter your city and state.');
    else setError('location', '');

    if (!getValue('jobsPerMonth')) fail('jobsPerMonth', 'Please choose how many jobs you do per month.');
    else setError('jobsPerMonth', '');

    if (getChecked('challenges').length === 0) fail('challenges', 'Pick at least one challenge.');
    else setError('challenges', '');

    if (getChecked('isOwner').length === 0) fail('isOwner', 'Please let us know if you are the decision maker.');
    else setError('isOwner', '');

    if (getChecked('budget').length === 0) fail('budget', 'Please select an answer.');
    else setError('budget', '');

    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: false });
    }
    return ok;
  }

  function collectAnswers() {
    return {
      fullName: getValue('fullName'),
      businessName: getValue('businessName'),
      phone: getValue('phone'),
      location: getValue('location'),
      jobsPerMonth: getValue('jobsPerMonth'),
      challenges: getChecked('challenges'),
      isOwner: (getChecked('isOwner')[0] || ''),
      budget: (getChecked('budget')[0] || '')
    };
  }

  /* Silent qualification scoring.
     Disqualifiers: 1–3 jobs/month, not the owner, or "No" budget. */
  function isQualified(a) {
    if (a.jobsPerMonth === '1-3') return false;
    if (a.isOwner === 'No') return false;
    if (a.budget === 'No') return false;
    return true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var answers = collectAnswers();
    var qualified = isQualified(answers);

    var payload = {
      qualified: qualified,
      submittedAt: new Date().toISOString(),
      answers: answers
    };

    // Fire-and-forget POST to the webhook; redirect regardless of network result.
    try {
      if (WEBHOOK_URL && WEBHOOK_URL.indexOf('example.com') === -1 && 'fetch' in window) {
        fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(function () { /* swallow — UX continues to thank-you */ });
      } else {
        console.log('[audit-form] payload ready to POST to WEBHOOK_URL:', payload);
      }
    } catch (err) {
      console.warn('[audit-form] webhook send skipped:', err);
    }

    // Everyone lands on thank-you; ?q=1 qualified, ?q=0 unqualified.
    window.location.href = 'thank-you.html?q=' + (qualified ? '1' : '0');
  });
})();
