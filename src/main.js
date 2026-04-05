/* ── Japan 2026 Trip App — Client-side JS ── */

(function () {
  'use strict';

  /* ── Module expand/collapse (section pages) ── */
  document.querySelectorAll('.module-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var mod = header.closest('.module');
      mod.classList.toggle('open');
    });
  });

  /* ── Packing checkboxes + localStorage ── */
  var STORAGE_KEY = 'japan2026-packing';

  function loadPackingState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function savePackingState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* quota exceeded — fail silently */ }
  }

  var packingState = loadPackingState();

  function updateProgress() {
    var all = document.querySelectorAll('.pack-item');
    var checked = document.querySelectorAll('.pack-item.checked');
    var pct = all.length ? (checked.length / all.length * 100) : 0;

    var fill = document.getElementById('progressFill');
    var label = document.getElementById('progressLabel');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = checked.length + ' / ' + all.length + ' packed';

    // Per-section counts
    document.querySelectorAll('.pack-section').forEach(function (section) {
      var grid = section.querySelector('.item-grid');
      var countEl = section.querySelector('.section-count');
      if (!grid || !countEl) return;
      var total = grid.querySelectorAll('.pack-item').length;
      var done = grid.querySelectorAll('.pack-item.checked').length;
      countEl.textContent = done === total ? '✓ all packed' : done + '/' + total;
    });
  }

  // Initialize packing items from localStorage
  document.querySelectorAll('.pack-item').forEach(function (item) {
    var id = item.getAttribute('data-id');
    if (id && packingState[id]) {
      item.classList.add('checked');
    }

    item.addEventListener('click', function () {
      item.classList.toggle('checked');
      var itemId = item.getAttribute('data-id');
      if (itemId) {
        if (item.classList.contains('checked')) {
          packingState[itemId] = true;
        } else {
          delete packingState[itemId];
        }
        savePackingState(packingState);
      }
      updateProgress();
    });
  });

  // Global reset button
  var resetBtn = document.getElementById('packingReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (!confirm('Uncheck all items?')) return;
      packingState = {};
      savePackingState(packingState);
      document.querySelectorAll('.pack-item.checked').forEach(function (item) {
        item.classList.remove('checked');
      });
      updateProgress();
    });
  }

  // Initial progress count
  if (document.querySelector('.pack-item')) {
    updateProgress();
  }

  /* ── Intersection Observer for sticky nav active state ── */
  function setupNavObserver(sectionSelector, navSelector) {
    var sections = document.querySelectorAll(sectionSelector);
    var navLinks = document.querySelectorAll(navSelector);
    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          var active = document.querySelector(navSelector + '[href="#' + entry.target.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // Day nav on section pages
  setupNavObserver('.day-section', '.day-nav a');

  // Section nav on packing page
  setupNavObserver('.pack-section, .bag-map', '.section-nav a');

  /* ── Active top nav link ── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.top-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();
