(function () {
  'use strict';

  /* ==========================================================================
     1. THEME MANAGER (LIGHT / DARK MODE)
     ========================================================================== */
  const themeStorageKey = 'avinash-portfolio-theme';
  const htmlEl = document.documentElement;

  function getSavedTheme() {
    try { return localStorage.getItem(themeStorageKey); } catch (e) { return null; }
  }

  function getPreferredTheme() {
    const saved = getSavedTheme();
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    try { localStorage.setItem(themeStorageKey, theme); } catch (e) { /* storage blocked: theme still applies */ }
  }

  function toggleTheme() {
    applyTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', () => {
    ['theme-toggle-btn', 'theme-toggle-btn-mobile'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', toggleTheme);
    });
  });

  /* ==========================================================================
     2. SIDEBAR DRAWER (MOBILE)
     ========================================================================== */
  function setMenu(open) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-menu-overlay');
    const toggle = document.getElementById('mobile-menu-toggle');
    if (!sidebar) return;
    sidebar.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('open', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('mobile-menu-toggle');
    const close = document.getElementById('mobile-menu-close');
    const overlay = document.getElementById('mobile-menu-overlay');
    if (toggle) toggle.addEventListener('click', () => {
      setMenu(!document.getElementById('sidebar').classList.contains('open'));
    });
    if (close) close.addEventListener('click', () => setMenu(false));
    if (overlay) overlay.addEventListener('click', () => setMenu(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  });

  /* ==========================================================================
     3. PANEL ROUTER (ONE SECTION AT A TIME, DEEP LINKS VIA #hash)
     ========================================================================== */
  const DEFAULT_PANEL = 'about';

  function panelKeyFor(el) {
    const panel = el && el.closest ? el.closest('.panel') : null;
    return panel ? panel.dataset.panel : null;
  }

  function showPanel(key) {
    document.querySelectorAll('.panel').forEach(p => { p.hidden = p.dataset.panel !== key; });
    document.querySelectorAll('.side-link').forEach(a => {
      if (a.dataset.panel === key) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  // Show whichever panel holds the target id, then scroll to it (or to the top)
  function route(id, opts) {
    opts = opts || {};
    const target = id && id !== 'top' ? document.getElementById(id) : null;
    const key = (target && panelKeyFor(target)) || (id && document.querySelector('.panel[data-panel="' + id + '"]') ? id : DEFAULT_PANEL);
    showPanel(key);
    const entryTarget = target && !target.classList.contains('panel') ? target : null;
    if (entryTarget) {
      const top = entryTarget.getBoundingClientRect().top + window.pageYOffset - 16;
      window.scrollTo(0, top);
      entryTarget.classList.add('highlighted-section');
      setTimeout(() => entryTarget.classList.remove('highlighted-section'), 1000);
    } else if (!opts.keepScroll) {
      window.scrollTo(0, 0);
    }
    const label = document.querySelector('.panel[data-panel="' + key + '"] h2, .panel[data-panel="' + key + '"] h1');
    if (label) document.title = label.textContent.replace(/\s+/g, ' ').trim() + ' | Avinash Thadani';
  }

  window.goToEntry = function (id) {
    history.pushState(null, '', '#' + id);
    route(id);
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      e.preventDefault();
      history.pushState(null, '', '#' + id);
      setMenu(false);
      route(id);
    });

    // Role cards: clickable and keyboard-operable
    document.querySelectorAll('.role-card[data-goto]').forEach(card => {
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
      const go = () => window.goToEntry(card.dataset.goto);
      card.addEventListener('click', go);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });
    });

    window.addEventListener('popstate', () => route(location.hash.slice(1), { keepScroll: true }));
    route(location.hash.slice(1), { keepScroll: true });
  });

  /* ==========================================================================
     4. BOOK SLIDER MODAL ("Best Nursing Professor Ever")
     ========================================================================== */
  const bookPages = [
    { src: 'files/testimonials/IMG_0001.jpg', author: 'Cover — "Best Nursing Professor Ever"' },
    { src: 'files/testimonials/IMG_0002.jpg', author: 'Inside cover — From the first BScN cohort' },
    { src: 'files/testimonials/IMG_0003.jpg', author: 'C. C. · April 11, 2023' },
    { src: 'files/testimonials/IMG_0004.jpg', author: 'A. W. · April 12, 2023' },
    { src: 'files/testimonials/IMG_0005.jpg', author: 'C. P. · April 12, 2023' },
    { src: 'files/testimonials/IMG_0006.jpg', author: 'G. G. · April 12, 2023' },
    { src: 'files/testimonials/IMG_0007.jpg', author: 'P. C. · April 12, 2023' },
    { src: 'files/testimonials/IMG_0008.jpg', author: 'A. W. · April 12, 2023' },
    { src: 'files/testimonials/IMG_0009.jpg', author: 'K. K. · April 13, 2023' },
    { src: 'files/testimonials/IMG_0010.jpg', author: 'M. H. · BScN Cohort 1' }
  ];
  let currentBookPage = 0;

  function buildDots(containerId, count, current, onClick) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'book-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to item ' + (i + 1));
      dot.onclick = () => onClick(i);
      container.appendChild(dot);
    }
  }

  function setActiveDot(containerId, active) {
    const dots = document.querySelectorAll('#' + containerId + ' .book-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === active);
    });
  }

  function renderBookPage() {
    const img = document.getElementById('book-page-img');
    const author = document.getElementById('book-page-author');
    if (!img) return;

    img.classList.add('fading');
    setTimeout(() => {
      img.src = bookPages[currentBookPage].src;
      img.alt = bookPages[currentBookPage].author;
      if (author) author.textContent = bookPages[currentBookPage].author;
      img.classList.remove('fading');
    }, 150);

    const prevBtn = document.getElementById('book-prev');
    const nextBtn = document.getElementById('book-next');
    if (prevBtn) prevBtn.disabled = currentBookPage === 0;
    if (nextBtn) nextBtn.disabled = currentBookPage === bookPages.length - 1;

    setActiveDot('book-dots', currentBookPage);
  }

  function goToBookPage(idx) {
    currentBookPage = Math.max(0, Math.min(bookPages.length - 1, idx));
    renderBookPage();
  }

  window.bookPage = function (dir) { 
    goToBookPage(currentBookPage + dir); 
  };

  window.openBookModal = function () {
    currentBookPage = 0;
    buildDots('book-dots', bookPages.length, 0, goToBookPage);
    renderBookPage();
    const modal = document.getElementById('book-modal');
    if (modal) modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeBookModal = function () {
    const modal = document.getElementById('book-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.closeBookModalOnBg = function (e) {
    if (e.target === document.getElementById('book-modal')) {
      window.closeBookModal();
    }
  };

  // Keyboard Navigation for Book Modal
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('book-modal');
    if (!modal || !modal.classList.contains('open')) return;
    if (e.key === 'ArrowRight') window.bookPage(1);
    if (e.key === 'ArrowLeft') window.bookPage(-1);
    if (e.key === 'Escape') window.closeBookModal();
  });

  // Touch Swipe for Book Modal
  document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.getElementById('book-page-viewer');
    if (!viewer) return;
    
    let touchStartX = 0;
    viewer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    viewer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 50) {
        window.bookPage(diffX < 0 ? 1 : -1);
      }
    }, { passive: true });
  });

  /* ==========================================================================
     5. COURSE FEEDBACK SURVEY (CFS) MODAL
     ========================================================================== */
  let cfsQuotes = [];
  let cfsIdx = 0;

  function buildCfsDots(count, current) {
    const container = document.getElementById('cfs-dots');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'book-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', 'Quote ' + (i + 1));
      dot.onclick = () => goToCfsQuote(i);
      container.appendChild(dot);
    }
  }

  function renderCfsQuote() {
    const quoteText = document.getElementById('cfs-quote-text');
    if (!quoteText) return;

    quoteText.style.opacity = '0';
    setTimeout(() => {
      quoteText.textContent = `"${cfsQuotes[cfsIdx]}"`;
      quoteText.style.opacity = '1';
    }, 120);

    const counter = document.getElementById('cfs-quote-counter');
    if (counter) counter.textContent = `Quote ${cfsIdx + 1} of ${cfsQuotes.length}`;

    const prevBtn = document.getElementById('cfs-prev');
    const nextBtn = document.getElementById('cfs-next');
    if (prevBtn) prevBtn.disabled = cfsIdx === 0;
    if (nextBtn) nextBtn.disabled = cfsIdx === cfsQuotes.length - 1;

    const dots = document.querySelectorAll('#cfs-dots .book-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === cfsIdx);
    });
  }

  function goToCfsQuote(idx) {
    cfsIdx = Math.max(0, Math.min(cfsQuotes.length - 1, idx));
    renderCfsQuote();
  }

  window.cfsQuote = function (dir) { 
    goToCfsQuote(cfsIdx + dir); 
  };

  window.openCfsModal = function (card) {
    const rawQuotes = card.getAttribute('data-quotes');
    if (!rawQuotes) return;

    cfsQuotes = JSON.parse(rawQuotes);
    cfsIdx = 0;

    const labelVal = card.querySelector('.testimonial-label')?.textContent || '';
    const tagVal = card.querySelector('.testimonial-tag')?.textContent || '';
    const pdfVal = card.getAttribute('data-pdf') || '#';

    // Normalize PDF path to lowercase in link just in case
    const normalizedPdf = pdfVal.replace(/^Files\//i, 'files/');

    const titleEl = document.getElementById('cfs-modal-title');
    const subEl = document.getElementById('cfs-modal-sub');
    const pdfLinkEl = document.getElementById('cfs-pdf-link');

    if (titleEl) titleEl.textContent = labelVal;
    if (subEl) subEl.textContent = tagVal;
    if (pdfLinkEl) pdfLinkEl.href = normalizedPdf;

    buildCfsDots(cfsQuotes.length, 0);
    renderCfsQuote();

    const cfsModal = document.getElementById('cfs-modal');
    if (cfsModal) cfsModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeCfsModal = function () {
    const cfsModal = document.getElementById('cfs-modal');
    if (cfsModal) cfsModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.closeCfsModalOnBg = function (e) {
    if (e.target === document.getElementById('cfs-modal')) {
      window.closeCfsModal();
    }
  };

  // Keyboard navigation for CFS modal
  document.addEventListener('keydown', (e) => {
    const cfsModal = document.getElementById('cfs-modal');
    if (!cfsModal || !cfsModal.classList.contains('open')) return;
    if (e.key === 'ArrowRight') window.cfsQuote(1);
    if (e.key === 'ArrowLeft') window.cfsQuote(-1);
    if (e.key === 'Escape') window.closeCfsModal();
  });

  /* ==========================================================================
     6. GENERAL LIGHTBOX OVERLAY
     ========================================================================== */
  let currentLightboxIdx = 0;
  let visibleCards = [];

  function getVisibleCards() {
    return Array.from(document.querySelectorAll('.testimonial-grid .testimonial-card'))
      .filter(card => card.style.display !== 'none');
  }

  window.openLightbox = function (dataIndex) {
    visibleCards = getVisibleCards();
    const pos = visibleCards.findIndex(card => parseInt(card.getAttribute('data-index')) === dataIndex);
    currentLightboxIdx = pos === -1 ? 0 : pos;
    renderLightbox();

    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.closeLightboxOnBg = function (e) {
    if (e.target === document.getElementById('lightbox')) {
      window.closeLightbox();
    }
  };

  window.shiftLightbox = function (dir) {
    visibleCards = getVisibleCards();
    currentLightboxIdx = Math.max(0, Math.min(visibleCards.length - 1, currentLightboxIdx + dir));
    renderLightbox();
  };

  function renderLightbox() {
    const card = visibleCards[currentLightboxIdx];
    if (!card) return;

    const type = card.getAttribute('data-type');
    let src = card.getAttribute('data-src') || '';
    
    // Normalize source paths to lowercase files/
    if (src) src = src.replace(/^Files\//i, 'files/');

    const labelVal = card.querySelector('.testimonial-label')?.textContent || '';
    const tagVal = card.querySelector('.testimonial-tag')?.textContent || '';

    const titleEl = document.getElementById('lightbox-title');
    if (titleEl) titleEl.textContent = `${labelVal} — ${tagVal}`;

    const counterEl = document.getElementById('lb-counter');
    if (counterEl) counterEl.textContent = `${currentLightboxIdx + 1} of ${visibleCards.length}`;

    const prevBtn = document.getElementById('lb-prev');
    const nextBtn = document.getElementById('lb-next');
    if (prevBtn) prevBtn.disabled = currentLightboxIdx === 0;
    if (nextBtn) nextBtn.disabled = currentLightboxIdx === visibleCards.length - 1;

    const bodyEl = document.getElementById('lightbox-body');
    if (!bodyEl) return;

    if (type === 'image' && src) {
      bodyEl.innerHTML = `<img src="${src}" alt="${labelVal}">`;
    } else if (type === 'pdf' && src) {
      bodyEl.innerHTML = `
        <div class="pdf-placeholder">
          <div class="pdf-icon">📄</div>
          <p>${labelVal}</p>
          <a href="${src}" target="_blank" class="lightbox-nav-btn" style="text-decoration:none;">Open PDF ↗</a>
        </div>`;
    } else {
      bodyEl.innerHTML = `
        <div class="pdf-placeholder">
          <div class="pdf-icon">🖼️</div>
          <p style="color:var(--text-muted);font-style:italic;">Placeholder — upload file and update data-type and data-src on this card.</p>
        </div>`;
    }
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'ArrowRight') window.shiftLightbox(1);
    if (e.key === 'ArrowLeft') window.shiftLightbox(-1);
    if (e.key === 'Escape') window.closeLightbox();
  });

  /* ==========================================================================
     7. TESTIMONIALS CATEGORY FILTER
     ========================================================================== */
  window.filterTestimonials = function (category, btn) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('#testimonial-grid .testimonial-card');
    cards.forEach(card => {
      const cats = (card.getAttribute('data-category') || '').split(' ');
      if (category === 'all' || cats.includes(category)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  };

  /* ==========================================================================
     8. TEACHING PHILOSOPHY TOGGLER
     ========================================================================== */
  window.togglePhilosophy = function () {
    const panel = document.getElementById('phil-extended');
    const icon  = document.getElementById('phil-toggle-icon');
    const btn   = document.getElementById('phil-toggle-btn');
    if (!panel) return;
    if (panel.style.display === 'none') {
      panel.style.display = 'block';
      if (icon) icon.style.transform = 'rotate(90deg)';
      if (btn) {
        btn.textContent = '';
        btn.insertAdjacentHTML('afterbegin', '<span id="phil-toggle-icon" style="font-size:0.7rem; transition:transform 0.25s; transform:rotate(90deg); display:inline-block;">▶</span> Collapse full teaching philosophy');
      }
    } else {
      panel.style.display = 'none';
      if (icon) icon.style.transform = 'rotate(0deg)';
      if (btn) {
        btn.textContent = '';
        btn.insertAdjacentHTML('afterbegin', '<span id="phil-toggle-icon" style="font-size:0.7rem; transition:transform 0.25s; display:inline-block;">▶</span> Read full teaching philosophy');
      }
    }
  };

  /* ==========================================================================
     9. TRANSITION CLEANUP & INITIALIZATION
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    // Add transitioning transition effect to cfs text
    const cfsText = document.getElementById('cfs-quote-text');
    if (cfsText) {
      cfsText.style.transition = 'opacity 0.15s ease';
    }
  });

  /* ==========================================================================
     10. CFS CARD SELECTOR & SEMESTER FILTER
     ========================================================================== */
  let currentSemester = 'Winter 2026'; // Default to newest semester on load
  let currentReport = 'all';
  let currentCategory = 'all';

  document.addEventListener('DOMContentLoaded', () => {
    const selectorPanel = document.getElementById('cfs-selector-panel');
    if (selectorPanel) {
      selectorPanel.style.display = 'block';
    }

    initCfsFilters();
    
    // Set default value in dropdown to Winter 2026
    const semesterSelect = document.getElementById('cfs-semester-select');
    if (semesterSelect) {
      semesterSelect.value = 'Winter 2026';
    }
    
    // Initial filter apply
    applyCfsFilters();
  });

  function initCfsFilters() {
    const grid = document.getElementById('testimonial-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.testimonial-card[data-type="cfs"]');
    cards.forEach(card => {
      // Set semester attribute dynamically from the card text
      const labelText = card.querySelector('.testimonial-label').textContent;
      const semester = labelText.split('·')[0].trim(); // "Fall 2023", "Winter 2026", etc.
      card.setAttribute('data-semester', semester);

      // Set tag/title for dropdown options
      const tagText = card.querySelector('.testimonial-tag').textContent;
      const subText = card.querySelector('.testimonial-sub').textContent.split('·')[0].trim(); // "Section 12516"
      const displayName = `${tagText} (${subText})`;
      card.setAttribute('data-display-name', displayName);
    });

    updateReportSelect();
  }

  function updateReportSelect() {
    const reportSelect = document.getElementById('cfs-report-select');
    if (!reportSelect) return;

    // Clear existing options except the first one
    reportSelect.innerHTML = '<option value="all">All Reports in Semester</option>';

    if (currentSemester === 'all') {
      const grid = document.getElementById('testimonial-grid');
      const cards = grid.querySelectorAll('.testimonial-card[data-type="cfs"]');
      
      // Group cards by semester to create optgroups
      const semesterGroups = {};
      cards.forEach(card => {
        const sem = card.getAttribute('data-semester');
        if (!semesterGroups[sem]) semesterGroups[sem] = [];
        semesterGroups[sem].push(card);
      });

      // Sort semesters descending
      const sortedSemesters = Object.keys(semesterGroups).sort((a, b) => {
        const yearA = parseInt(a.match(/\d+/)[0]);
        const yearB = parseInt(b.match(/\d+/)[0]);
        if (yearA !== yearB) return yearB - yearA;
        return b.localeCompare(a); // Fall vs Winter
      });

      sortedSemesters.forEach(sem => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = sem;
        semesterGroups[sem].forEach(card => {
          const option = document.createElement('option');
          option.value = card.getAttribute('data-index');
          option.textContent = card.getAttribute('data-display-name');
          optgroup.appendChild(option);
        });
        reportSelect.appendChild(optgroup);
      });
    } else {
      // Find cards matching currentSemester
      const grid = document.getElementById('testimonial-grid');
      const cards = grid.querySelectorAll(`.testimonial-card[data-type="cfs"][data-semester="${currentSemester}"]`);
      cards.forEach(card => {
        const option = document.createElement('option');
        option.value = card.getAttribute('data-index');
        option.textContent = card.getAttribute('data-display-name');
        reportSelect.appendChild(option);
      });
    }
  }

  window.handleSemesterChange = function(val) {
    currentSemester = val;
    currentReport = 'all'; // Reset report selection when semester changes
    
    const reportSelect = document.getElementById('cfs-report-select');
    if (reportSelect) reportSelect.value = 'all';
    
    updateReportSelect();
    applyCfsFilters();
  };

  window.handleReportChange = function(val) {
    currentReport = val;
    applyCfsFilters();
  };

  // Override the filterTestimonials function to work with our filters
  window.filterTestimonials = function (category, btn) {
    currentCategory = category;
    
    // Call active class toggling of buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // Show/hide cfs selector panel based on category
    const selectorPanel = document.getElementById('cfs-selector-panel');
    if (selectorPanel) {
      if (category === 'general') {
        selectorPanel.style.display = 'none';
      } else {
        selectorPanel.style.display = 'block';
      }
    }

    applyCfsFilters();
  };

  function applyCfsFilters() {
    const cards = document.querySelectorAll('#testimonial-grid .testimonial-card');
    
    cards.forEach(card => {
      const type = card.getAttribute('data-type');
      const cats = (card.getAttribute('data-category') || '').split(' ');
      const semester = card.getAttribute('data-semester') || '';
      const index = card.getAttribute('data-index') || '';

      // Check category match
      const categoryMatches = (currentCategory === 'all' || cats.includes(currentCategory));

      if (type === 'book') {
        // Book card rules: always display on the left-hand side
        card.style.display = '';
      } else {
        // Survey card rules:
        const semesterMatches = (currentSemester === 'all' || semester === currentSemester);
        const reportMatches = (currentReport === 'all' || index === currentReport);
        
        // Hide cfs reports completely when general (special) tab is clicked
        const isVisible = (currentCategory !== 'general') && categoryMatches && semesterMatches && reportMatches;
        card.style.display = isVisible ? '' : 'none';
      }
    });
  }

  /* ==========================================================================
     8. SIMULATION MODAL
     ========================================================================== */
  window.openSimulationModal = function (url) {
    const modal = document.getElementById('sim-modal');
    const iframe = document.getElementById('sim-iframe');
    if (modal && iframe) {
      iframe.src = url;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // prevent page scroll
    }
  };

  window.closeSimulationModal = function () {
    const modal = document.getElementById('sim-modal');
    const iframe = document.getElementById('sim-iframe');
    if (modal && iframe) {
      modal.style.display = 'none';
      iframe.src = ''; // reset source to stop any running audio/processes
      document.body.style.overflow = ''; // restore scroll
    }
  };

  window.closeSimulationModalOnBg = function (e) {
    if (e.target.id === 'sim-modal') {
      window.closeSimulationModal();
    }
  };

})();
