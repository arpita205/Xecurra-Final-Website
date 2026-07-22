/* ============================================================
   XECURRA — MAIN JAVASCRIPT
   main.js | Navigation, Mobile Menu, WhatsApp, AOS, Utilities
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar Scroll Effect ──────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('navbar--scrolled');
        navbar.classList.remove('navbar--transparent');
      } else {
        navbar.classList.remove('navbar--scrolled');
        navbar.classList.add('navbar--transparent');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Hamburger Menu ─────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Mobile Sub-Menu Toggles (with Back Button) ──────── */
  document.querySelectorAll('.mobile-nav-item > a[data-has-sub]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const item = link.closest('.mobile-nav-item');
      const sub = item.querySelector('.mobile-sub');
      if (sub) {
        // Close all other open subs
        document.querySelectorAll('.mobile-sub.open').forEach(openSub => {
          if (openSub !== sub) openSub.classList.remove('open');
        });
        sub.classList.toggle('open');
        const arrow = link.querySelector('.m-arrow');
        if (arrow) arrow.style.transform = sub.classList.contains('open') ? 'rotate(180deg)' : '';
      }
    });
  });

  /* ── Active Nav Link ───────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-item > a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  /* ── Scroll-Reveal (Lightweight AOS alternative) ──────── */
  const revealEls = document.querySelectorAll('[data-aos]');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.aosDelay || 0;
            setTimeout(() => {
              el.classList.add('aos-animate');
            }, parseInt(delay));
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ── Counter Animation ─────────────────────────────────── */
  function animateCount(el, target, suffix, duration = 1800) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start).toLocaleString() + suffix;
    }, 16);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            animateCount(el, target, suffix);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ── Tab System ────────────────────────────────────────── */
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const groupName = group.dataset.tabGroup;
    const buttons = group.querySelectorAll('[data-tab-btn]');
    const panels = document.querySelectorAll(`[data-tab-panel="${groupName}"]`);

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
  });

  /* ── Persona Selector (Solutions) ─────────────────────── */
  const personaCards = document.querySelectorAll('.sol-persona-card');
  const solutionPanels = document.querySelectorAll('.solution-panel');

  if (personaCards.length > 0) {
    personaCards.forEach((card, i) => {
      card.addEventListener('click', () => {
        personaCards.forEach(c => c.classList.remove('active'));
        solutionPanels.forEach(p => p.classList.remove('active'));
        card.classList.add('active');
        if (solutionPanels[i]) solutionPanels[i].classList.add('active');
      });
    });
  }

  /* ── Accordion ─────────────────────────────────────────── */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      const group = item.closest('[data-accordion]');
      if (group) {
        group.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      }
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── FAQ Toggle ─────────────────────────────────────────── */
  document.querySelectorAll('.faq-item__q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close siblings
      const grid = item.closest('.faq-grid');
      if (grid) {
        grid.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      }
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Form Submit Handler ───────────────────────────────── */
  document.querySelectorAll('form[data-form]').forEach(form => {
    // If it's the newsletter form, it's handled below
    if (form.classList.contains('newsletter-form')) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      // Gather form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // We will attempt to grab inputs if they don't have name attributes
      if (Object.keys(data).length === 0) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          if (input.id || input.name || input.type) {
            const key = input.name || input.id || input.type;
            data[key] = input.value;
          }
        });
      }

      const endpoint = form.dataset.form === 'demo' ? '/api/demo' : '/api/contact';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          btn.textContent = '✓ Message Sent!';
          btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
          form.reset();
        } else {
          btn.textContent = '❌ Failed to send';
          btn.style.background = '#EF4444';
        }
      } catch (err) {
        console.error(err);
        btn.textContent = '❌ Error';
        btn.style.background = '#EF4444';
      } finally {
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalText;
          btn.style.background = '';
        }, 4000);
      }
    });
  });

  /* ── Newsletter Form ───────────────────────────────────── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const input = form.querySelector('input[type="email"]');
      const originalText = btn.textContent;
      
      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: input ? input.value : '' })
        });

        if (response.ok) {
          btn.textContent = '✓ Subscribed!';
          btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
          form.reset();
        } else {
          btn.textContent = '❌ Failed';
          btn.style.background = '#EF4444';
        }
      } catch (err) {
        console.error(err);
        btn.textContent = '❌ Error';
        btn.style.background = '#EF4444';
      } finally {
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }
    });
  });

  /* ── Smooth scroll for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Demo Modal (Calendly placeholder) ────────────────── */
  const demoModal = document.getElementById('demo-modal');
  const demoOverlay = document.getElementById('demo-overlay');

  document.querySelectorAll('[data-demo-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (demoModal) {
        demoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (demoOverlay) {
    demoOverlay.addEventListener('click', closeDemoModal);
  }

  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeDemoModal);
  }

  function closeDemoModal() {
    if (demoModal) {
      demoModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDemoModal();
  });

  /* ── Sticky RFQ Tab ────────────────────────────────────── */
  const rfqTab = document.querySelector('.rfq-sticky-tab');
  if (rfqTab) {
    window.addEventListener('scroll', () => {
      rfqTab.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

})();
