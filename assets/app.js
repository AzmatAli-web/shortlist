/* ============================================================
   Shortlist — application
   Favourites, filtering, recommendations. No dependencies.
   ============================================================ */
(function () {
  'use strict';

  var SL = window.SL;
  if (!SL || !SL.tools || !SL.categories) return;

  var TOOLS = SL.tools;
  var CATS = SL.categories;
  var PAGE = document.body.getAttribute('data-page') || '';
  var BASE = document.body.getAttribute('data-base') || '';

  var SAVE_KEY = 'shortlist.saved.v1';
  var THEME_KEY = 'shortlist.theme';

  var PRICE = { free: 'Free', freemium: 'Free plan', paid: 'Paid', oss: 'Open source' };
  var PLATFORM = { web: 'Web', desktop: 'Desktop', mobile: 'Mobile', api: 'API' };

  /* ---------- storage ---------- */

  function readStore(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeStore(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }

  function readSaved() {
    var out = new Set();
    var raw = readStore(SAVE_KEY);
    if (!raw) return out;
    try {
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return out;
      arr.forEach(function (id) {
        if (typeof id === 'string' && TOOLS.some(function (t) { return t.id === id; })) out.add(id);
      });
    } catch (e) { /* corrupt value, start empty */ }
    return out;
  }

  var saved = readSaved();

  function persistSaved() {
    writeStore(SAVE_KEY, JSON.stringify(Array.from(saved)));
  }

  /* ---------- helpers ---------- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function catOf(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].s === id) return CATS[i];
    return CATS[0];
  }
  function toolOf(id) {
    for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].id === id) return TOOLS[i];
    return null;
  }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function url(path) { return BASE + path; }
  function toolURL(id) { return url('tools/' + id + '.html'); }

  function plate(t, size) {
    return '<span class="plate' + (size ? ' ' + size : '') + '" aria-hidden="true">' + esc(t.ab) + '</span>';
  }
  function priceChip(t) {
    var cls = t.p === 'oss' ? 'price-oss' : (t.p === 'paid' ? 'price-paid' : 'price-free');
    return '<span class="price ' + cls + '">' + (PRICE[t.p] || t.p) + '</span>';
  }
  function saveButton(t, extraClass) {
    var on = saved.has(t.id);
    return '<button class="' + (extraClass || 'save') + '" type="button" data-save="' + t.id + '"' +
      ' aria-pressed="' + on + '" aria-label="' + (on ? 'Remove ' : 'Save ') + esc(t.n) +
      (on ? ' from' : ' to') + ' your shortlist">' +
      '<svg class="ic" aria-hidden="true"><use href="#i-star"/></svg>' +
      (extraClass && extraClass.indexOf('btn') > -1 ? '<span data-save-label>' + (on ? 'Saved' : 'Save') + '</span>' : '') +
      '</button>';
  }

  /* ---------- toast ---------- */

  var toastEl = null;
  var toastTimer = 0;
  function toast(message) {
    if (!toastEl) toastEl = $('#toast');
    if (!toastEl) return;
    toastEl.innerHTML = '<svg class="ic ic-sm" aria-hidden="true"><use href="#i-check"/></svg><span>' + esc(message) + '</span>';
    toastEl.setAttribute('data-on', 'true');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toastEl.setAttribute('data-on', 'false'); }, 2600);
  }

  /* ---------- theme ---------- */

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    writeStore(THEME_KEY, theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0F120E' : '#F2F0E7');
    var btn = $('#themeBtn');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  function initTheme() {
    var btn = $('#themeBtn');
    var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  /* ---------- saved state ---------- */

  function syncSavedUI() {
    $$('[data-save]').forEach(function (btn) {
      var id = btn.getAttribute('data-save');
      var t = toolOf(id);
      if (!t) return;
      var on = saved.has(id);
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', (on ? 'Remove ' : 'Save ') + t.n + (on ? ' from' : ' to') + ' your shortlist');
      if (btn.classList.contains('btn')) {
        btn.classList.toggle('btn-saved', on);
        btn.classList.toggle('btn-line', !on);
        var label = btn.querySelector('[data-save-label]');
        if (label) label.textContent = on ? 'Saved' : 'Save to shortlist';
      }
    });
    $$('[data-save-count]').forEach(function (node) { node.textContent = String(saved.size); });
    var pill = $('.save-pill');
    if (pill) {
      pill.setAttribute('data-on', saved.size > 0 ? 'true' : 'false');
      pill.setAttribute('aria-label', 'Your shortlist, ' + saved.size + (saved.size === 1 ? ' tool saved' : ' tools saved'));
    }
  }

  function toggleSave(id) {
    var t = toolOf(id);
    if (!t) return;
    var wasSaved = saved.has(id);
    if (wasSaved) saved.delete(id); else saved.add(id);
    persistSaved();
    syncSavedUI();
    if (PAGE === 'favorites') {
      renderFavorites(wasSaved ? 'remove' : 'add', id);
    }
    toast(wasSaved ? t.n + ' removed from your shortlist' : t.n + ' saved to your shortlist');
  }

  function initSaveDelegation() {
    document.addEventListener('click', function (event) {
      var btn = event.target.closest ? event.target.closest('[data-save]') : null;
      if (!btn) return;
      event.preventDefault();
      toggleSave(btn.getAttribute('data-save'));
    });
    window.addEventListener('storage', function (event) {
      if (event.key !== SAVE_KEY) return;
      saved = readSaved();
      syncSavedUI();
      if (PAGE === 'favorites') renderFavorites();
    });
  }

  /* ---------- search + nav ---------- */

  function initHeader() {
    $$('[data-save-count]').forEach(function (node) { node.textContent = String(saved.size); });
    var form = $('[data-search-form]');
    if (form && PAGE === 'browse') {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        if (!input) return;
        state.q = input.value;
        syncURL();
        renderBrowse();
        var pageInput = $('#pageQ');
        if (pageInput) pageInput.value = state.q;
      });
    }
    document.addEventListener('keydown', function (event) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      var tag = (event.target && event.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || event.target.isContentEditable) return;
      var input = $('.hsearch input');
      if (!input || input.offsetParent === null) input = $('#pageQ');
      if (input) { event.preventDefault(); input.focus(); input.select(); }
    });
  }

  /* ---------- browse ---------- */

  var state = { q: '', cat: 'all', price: 'all', where: 'all', sort: 'pick', picks: false };

  var SORTS = { pick: "Editor's order", az: 'A to Z', new: 'Newest first' };

  function readBrowseState() {
    var params = new URLSearchParams(window.location.search);
    var cat = params.get('cat') || 'all';
    var price = params.get('price') || 'all';
    var where = params.get('where') || 'all';
    var sort = params.get('sort') || 'pick';
    state.q = params.get('q') || '';
    state.cat = catOf(cat).s === cat ? cat : 'all';
    state.price = PRICE[price] || price === 'all' ? price : 'all';
    if (price !== 'free' && price !== 'paid' && price !== 'oss') state.price = 'all';
    state.where = PLATFORM[where] ? where : 'all';
    state.sort = SORTS[sort] ? sort : 'pick';
    state.picks = params.get('picks') === '1';
  }

  function searchMatch(t, query) {
    if (!query) return true;
    var hay = (t.n + ' ' + t.t + ' ' + (t.tags || '') + ' ' + catOf(t.c).n + ' ' + catOf(t.c).d +
      ' ' + (t.good || []).join(' ')).toLowerCase();
    return query.toLowerCase().split(/\s+/).filter(Boolean).every(function (word) {
      return hay.indexOf(word) > -1;
    });
  }

  function filtered() {
    var list = TOOLS.filter(function (t) {
      if (state.cat !== 'all' && t.c !== state.cat) return false;
      if (state.price === 'free' && ['free', 'freemium', 'oss'].indexOf(t.p) === -1) return false;
      if (state.price !== 'all' && state.price !== 'free' && t.p !== state.price) return false;
      if (state.where !== 'all' && t.pl.indexOf(state.where) === -1) return false;
      if (state.picks && !t.pick) return false;
      return searchMatch(t, state.q);
    });
    if (state.sort === 'az') {
      list.sort(function (a, b) { return a.n.localeCompare(b.n); });
    } else if (state.sort === 'new') {
      list.sort(function (a, b) {
        var ra = (a.newRank == null || a.newRank < 0) ? 99 : a.newRank;
        var rb = (b.newRank == null || b.newRank < 0) ? 99 : b.newRank;
        return ra - rb || a.n.localeCompare(b.n);
      });
    } else {
      list.sort(function (a, b) {
        return (b.pick ? 1 : 0) - (a.pick ? 1 : 0) ||
          CATS.findIndex(function (c) { return c.s === a.c; }) - CATS.findIndex(function (c) { return c.s === b.c; }) ||
          a.n.localeCompare(b.n);
      });
    }
    return list;
  }

  function rowHTML(t, i) {
    return '<article class="trow">' +
      '<span class="idx" aria-hidden="true">' + pad(i + 1) + '</span>' +
      '<a href="' + toolURL(t.id) + '" tabindex="-1" aria-hidden="true">' + plate(t) + '</a>' +
      '<div><div class="nm"><a href="' + toolURL(t.id) + '">' + esc(t.n) + '</a></div>' +
      '<div class="tg">' + esc(t.t) + '</div></div>' +
      '<span class="cat">' + catOf(t.c).code + '</span>' +
      priceChip(t) +
      saveButton(t) +
      '</article>';
  }

  function emptyHTML() {
    var msg = state.q
      ? 'No tool matches <b>' + esc(state.q) + '</b> with these filters.'
      : 'No tool matches these filters yet.';
    return '<div class="empty"><h2>Nothing here yet.</h2><p>' + msg +
      ' The list is edited by hand, so a gap is usually just a tool we have not tested.</p>' +
      '<div class="acts"><button class="btn btn-ink" type="button" data-reset>Clear filters</button>' +
      '<a class="btn btn-line" href="' + url('recommend.html') + '">Find three tools</a></div></div>';
  }

  function isDirty() {
    return !!(state.q || state.cat !== 'all' || state.price !== 'all' || state.where !== 'all' ||
      state.sort !== 'pick' || state.picks);
  }

  function syncURL() {
    try {
      var u = new URL(window.location.href);
      var p = u.searchParams;
      var set = function (key, value, isDefault) {
        if (isDefault) p.delete(key); else p.set(key, value);
      };
      set('q', state.q, !state.q);
      set('cat', state.cat, state.cat === 'all');
      set('price', state.price, state.price === 'all');
      set('where', state.where, state.where === 'all');
      set('sort', state.sort, state.sort === 'pick');
      set('picks', '1', !state.picks);
      var next = u.pathname + (p.toString() ? '?' + p.toString() : '') + u.hash;
      window.history.replaceState(null, '', next);
    } catch (e) { /* file:// in some browsers */ }
  }

  function renderFilters() {
    $$('[data-cat]').forEach(function (el) {
      var value = el.getAttribute('data-cat');
      if (el.classList.contains('rail-link')) {
        el.setAttribute('aria-current', value === state.cat ? 'true' : 'false');
      } else {
        el.setAttribute('aria-pressed', String(value === state.cat));
      }
    });
    $$('[data-price]').forEach(function (el) {
      el.setAttribute('aria-pressed', String(el.getAttribute('data-price') === state.price));
    });
    var picks = $('#picksBtn');
    if (picks) picks.setAttribute('aria-pressed', String(state.picks));
    var sort = $('#sortSel');
    if (sort) sort.value = state.sort;
    var where = $('#whereSel');
    if (where) where.value = state.where;
    var reset = $('#resetBtn');
    if (reset) reset.hidden = !isDirty();
    var catTitle = $('#catTitle');
    if (catTitle) {
      var active = state.cat === 'all' ? null : catOf(state.cat);
      catTitle.textContent = active ? active.n : 'All tools';
      var desc = $('#catDesc');
      if (desc) desc.textContent = active ? active.d : 'Every tool on the list, with the job it is actually good at. Filter by what you can spend and where you work.';
      var resLabel = $('#resLabel');
      if (resLabel) resLabel.textContent = active ? active.n : 'The whole index';
      document.title = (active ? active.n : 'All tools') + ' — Shortlist';
    }
    setLive();
  }

  function setLive(text) {
    var live = $('#live');
    if (!live) return;
    live.textContent = text || '';
  }

  function renderBrowse() {
    var root = $('#results');
    if (!root) return;
    var list = filtered();
    root.innerHTML = list.length ? list.map(rowHTML).join('') : emptyHTML();
    var count = $('#resCount');
    if (count) count.textContent = String(list.length) + ' of ' + TOOLS.length;
    var clear = $('#qClear');
    if (clear) clear.hidden = !state.q;
    renderFilters();
    syncSavedUI();
    setLive(list.length + ' tools shown');
  }

  function initBrowse() {
    readBrowseState();

    var headerQ = $('.hsearch input');
    if (headerQ) headerQ.value = state.q;

    var pageQ = $('#pageQ');
    if (pageQ) {
      pageQ.value = state.q;
      pageQ.addEventListener('input', function () {
        state.q = pageQ.value;
        syncURL();
        renderBrowse();
      });
    }

    var filterBar = $('#filters');
    if (filterBar) {
      filterBar.addEventListener('click', function (event) {
        var cat = event.target.closest('[data-cat]');
        if (cat) {
          event.preventDefault();
          state.cat = cat.getAttribute('data-cat');
          syncURL(); renderBrowse();
          return;
        }
        var price = event.target.closest('[data-price]');
        if (price) {
          state.price = price.getAttribute('data-price');
          syncURL(); renderBrowse();
          return;
        }
        var picks = event.target.closest('[data-picks]');
        if (picks) {
          state.picks = !state.picks;
          syncURL(); renderBrowse();
          return;
        }
        if (event.target.closest('[data-reset]')) {
          resetFilters();
        }
      });
      var sort = $('#sortSel');
      if (sort) sort.addEventListener('change', function () { state.sort = sort.value; syncURL(); renderBrowse(); });
      var where = $('#whereSel');
      if (where) where.addEventListener('change', function () { state.where = where.value; syncURL(); renderBrowse(); });
    }

    var rail = $('#rail');
    if (rail) {
      rail.addEventListener('click', function (event) {
        var link = event.target.closest('[data-cat]');
        if (!link) return;
        event.preventDefault();
        state.cat = link.getAttribute('data-cat');
        syncURL(); renderBrowse();
      });
    }

    var clear = $('#qClear');
    if (clear) {
      clear.addEventListener('click', function () {
        state.q = '';
        if (pageQ) { pageQ.value = ''; pageQ.focus(); }
        syncURL(); renderBrowse();
      });
    }

    var root = $('#results');
    if (root) {
      root.addEventListener('click', function (event) {
        if (event.target.closest('[data-reset]')) resetFilters();
      });
    }

    document.addEventListener('click', function (event) {
      var reset = event.target.closest('[data-reset]');
      if (reset && !reset.closest('#filters')) resetFilters();
    });

    renderBrowse();
  }

  function resetFilters() {
    state.q = ''; state.cat = 'all'; state.price = 'all'; state.where = 'all'; state.sort = 'pick'; state.picks = false;
    var pageQ = $('#pageQ');
    if (pageQ) pageQ.value = '';
    var headerQ = $('.hsearch input');
    if (headerQ) headerQ.value = '';
    syncURL();
    renderBrowse();
  }

  /* ---------- favourites ---------- */

  var ADJACENT = {
    write: ['work', 'auto'],
    design: ['video', 'code'],
    code: ['data', 'auto'],
    video: ['design', 'audio'],
    audio: ['video', 'work'],
    work: ['write', 'auto'],
    auto: ['data', 'work'],
    data: ['auto', 'code']
  };

  function affinity(limit) {
    var items = TOOLS.filter(function (t) { return saved.has(t.id); });
    if (!items.length) {
      return TOOLS.filter(function (t) { return t.pick; }).slice(0, limit).map(function (t) {
        return { t: t, why: "Editor's pick", score: 0 };
      });
    }
    var weights = {};
    items.forEach(function (s) {
      weights[s.c] = (weights[s.c] || 0) + 3;
      (ADJACENT[s.c] || []).forEach(function (c) { weights[c] = (weights[c] || 0) + 1; });
    });
    var scored = TOOLS.filter(function (t) { return !saved.has(t.id); }).map(function (t) {
      var source = items.filter(function (s) { return s.c === t.c; })[0];
      var pair = items.filter(function (s) { return (ADJACENT[s.c] || []).indexOf(t.c) > -1; })[0];
      var score = weights[t.c] || 0;
      if (t.pick) score += 1.2;
      return { t: t, score: score, source: source, pair: pair };
    }).sort(function (a, b) { return b.score - a.score || a.t.n.localeCompare(b.t.n); });

    return scored.slice(0, limit).map(function (row, i) {
      if (row.source) {
        row.why = i % 2 === 0 ? 'Because you saved ' + row.source.n : 'More in ' + catOf(row.t.c).n;
      } else if (row.pair) {
        row.why = 'Pairs with ' + row.pair.n;
      } else {
        row.why = 'Worth a look';
      }
      return row;
    });
  }

  function savedGroups() {
    return CATS.map(function (c) {
      return {
        cat: c,
        items: TOOLS.filter(function (t) { return t.c === c.s && saved.has(t.id); })
      };
    }).filter(function (group) { return group.items.length; });
  }

  function recHTML(recs, title) {
    if (!recs.length) return '';
    return '<div class="card">' +
      '<h2>' + esc(title) + '</h2><div class="rec-list">' +
      recs.map(function (r) {
        return '<div class="rec"><div class="why">' + esc(r.why) + '</div>' +
          '<div class="row"><div><div class="nm"><a href="' + toolURL(r.t.id) + '">' + esc(r.t.n) + '</a></div>' +
          '<div class="tg">' + esc(r.t.t) + '</div></div>' + saveButton(r.t) + '</div></div>';
      }).join('') +
      '</div></div>';
  }

  function renderFavorites(mode, focusId) {
    var root = $('#savedRoot');
    if (!root) return;
    var groups = savedGroups();
    var count = saved.size;

    var head = $('#savedCount');
    if (head) head.textContent = count + (count === 1 ? ' tool saved' : ' tools saved');

    var body;
    if (!count) {
      body = '<div class="empty"><h2>Nothing saved yet.</h2>' +
        '<p>Tap the star beside any tool to keep it here. Saved tools stay in this browser — no account, no sync, nothing leaves your machine.</p>' +
        '<div class="acts"><a class="btn btn-ink" href="' + url('browse.html') + '">Browse the directory</a>' +
        '<a class="btn btn-line" href="' + url('recommend.html') + '">Find three tools</a></div></div>';
    } else {
      body = groups.map(function (group) {
        return '<section class="saved-group"><h2>' + esc(group.cat.n) +
          '<span class="n">' + pad(group.items.length) + '</span></h2>' +
          group.items.map(function (t) {
            return '<div class="saved-row">' + plate(t) +
              '<div><div class="nm"><a href="' + toolURL(t.id) + '">' + esc(t.n) + '</a></div>' +
              '<div class="tg">' + esc(t.t) + '</div></div>' +
              saveButton(t) + '</div>';
          }).join('') + '</section>';
      }).join('');
      body += '<div class="saved-more"><p>' + count + (count === 1 ? ' tool kept in this browser.' : ' tools kept in this browser.') + '</p>' +
        '<a class="link-btn" href="' + url('browse.html') + '">Add more from the directory</a>' +
        '<a class="link-btn" href="' + url('recommend.html') + '">Find three tools</a></div>';
    }

    root.innerHTML = body;

    var aside = $('#savedAside');
    if (aside) {
      var recs = affinity(3);
      aside.innerHTML = recHTML(recs, count ? 'Picked for you' : 'Start here') +
        '<div class="card"><h2>How saving works</h2>' +
        '<p class="aside-note">Your shortlist is stored in this browser using local storage. Clearing site data will clear it. ' +
        'Copy list gives you plain text you can paste into a note or an email.</p></div>';
    }

    var actions = $('#savedActions');
    if (actions) actions.hidden = count === 0;

    var clearBtn = $('#clearAll');
    if (clearBtn && !count) resetClearButton(clearBtn);

    syncSavedUI();

    if (mode === 'remove') {
      var nextSave = root.querySelector('[data-save]');
      if (nextSave) nextSave.focus({ preventScroll: true });
      else {
        var title = $('#savedTitle');
        if (title) title.focus({ preventScroll: true });
      }
    } else if (mode === 'add' && focusId) {
      var added = root.querySelector('[data-save="' + focusId + '"]');
      if (added) added.focus({ preventScroll: true });
    }
  }

  function resetClearButton(btn) {
    btn.removeAttribute('data-armed');
    btn.textContent = 'Clear all';
    btn.setAttribute('aria-label', 'Clear your shortlist');
  }

  function initFavorites() {
    renderFavorites();

    var copyBtn = $('#copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var items = TOOLS.filter(function (t) { return saved.has(t.id); });
        if (!items.length) return;
        var lines = ['My AI shortlist (' + items.length + (items.length === 1 ? ' tool' : ' tools') + ')', ''];
        CATS.forEach(function (c) {
          var group = items.filter(function (t) { return t.c === c.s; });
          if (!group.length) return;
          lines.push(c.n.toUpperCase());
          group.forEach(function (t) { lines.push('- ' + t.n + ': ' + t.t); });
          lines.push('');
        });
        var text = lines.join('\n').trim();
        copyText(text).then(function (ok) {
          if (ok) { toast('Shortlist copied to clipboard'); return; }
          if (!showCopyDialog(text)) toast('Copy was blocked. Your shortlist is still saved in this browser.');
        });
      });
    }

    var clearBtn = $('#clearAll');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (clearBtn.getAttribute('data-armed') !== 'true') {
          clearBtn.setAttribute('data-armed', 'true');
          clearBtn.textContent = 'Click again to confirm';
          clearBtn.setAttribute('aria-label', 'Confirm clearing your shortlist');
          window.setTimeout(function () {
            if (clearBtn.getAttribute('data-armed') === 'true') resetClearButton(clearBtn);
          }, 5000);
          return;
        }
        saved.clear();
        persistSaved();
        resetClearButton(clearBtn);
        renderFavorites('remove');
        toast('Shortlist cleared');
      });
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  function showCopyDialog(text) {
    var dialog = document.getElementById('copyDialog');
    var area = document.getElementById('copyText');
    if (!dialog || !area) return false;
    area.value = text;
    try {
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    } catch (e) {
      dialog.setAttribute('open', '');
    }
    window.setTimeout(function () { area.focus(); area.select(); }, 30);
    return true;
  }

  /* ---------- recommendations ---------- */

  var QUESTIONS = [
    {
      key: 'job',
      q: 'What are you trying to get done?',
      hint: 'Pick the job, not the tool category.',
      opts: [
        { v: 'write', t: 'Write and research', d: 'Drafting, reading, searching, checking a claim' },
        { v: 'design', t: 'Make something visual', d: 'Images, interfaces, a site that ships' },
        { v: 'code', t: 'Build or review software', d: 'Editors, agents, prototypes' },
        { v: 'media', t: 'Make video or audio', d: 'Shots, cuts, voice, music' },
        { v: 'ops', t: 'Run the operation', d: 'Meetings, notes, email, internal flows' },
        { v: 'data', t: 'Answer a data question', d: 'Analysis, charts, dashboards' }
      ]
    },
    {
      key: 'budget',
      q: 'What can you spend?',
      hint: 'A usable free tier counts as free.',
      opts: [
        { v: 'free', t: 'Free plan, please', d: 'No card, no trial clock' },
        { v: 'paid', t: 'Paid is fine', d: 'A tool that pays for itself' },
        { v: 'open', t: 'Prefer open source', d: 'Self-hosted or forkable' }
      ]
    },
    {
      key: 'where',
      q: 'Where do you work?',
      hint: 'We favour tools that run there natively.',
      opts: [
        { v: 'web', t: 'In the browser', d: 'Nothing to install' },
        { v: 'desktop', t: 'On the desktop', d: 'Mac, Windows or Linux' },
        { v: 'mobile', t: 'On my phone', d: 'Between other things' }
      ]
    }
  ];

  var JOB_CATS = {
    write: ['write'], design: ['design'], code: ['code'],
    media: ['video', 'audio'], ops: ['work', 'auto'], data: ['data']
  };
  var WHERE_TEXT = { web: 'in the browser', desktop: 'on the desktop', mobile: 'on mobile' };
  var JOB_PHRASE = {
    write: 'writing and research', design: 'visual work', code: 'shipping code',
    media: 'video and audio', ops: 'running the operation', data: 'data questions'
  };

  var quiz = { step: 0, answers: {}, done: false, results: [], touched: false };

  function scoreTools() {
    var cats = JOB_CATS[quiz.answers.job] || [];
    var pool = TOOLS.filter(function (t) { return cats.indexOf(t.c) > -1; });
    var scored = pool.map(function (t) {
      var score = 0;
      var why = [];
      if (t.pick) { score += 1.5; }
      if (quiz.answers.budget === 'free' && ['free', 'freemium', 'oss'].indexOf(t.p) > -1) {
        score += 3; why.push('Has a free plan');
      } else if (quiz.answers.budget === 'paid') {
        if (t.p === 'paid') { score += 3; why.push('Built for paying teams'); }
        else { score += 1.2; }
      } else if (quiz.answers.budget === 'open') {
        if (t.p === 'oss') { score += 4; why.push('Open source'); }
        else { score += 0.4; }
      }
      if (t.pl.indexOf(quiz.answers.where) > -1) {
        score += 2; why.push('Runs ' + (WHERE_TEXT[quiz.answers.where] || 'here'));
      }
      if (t.pick) why.push("Editor's pick");
      return { t: t, score: score, why: why };
    }).sort(function (a, b) {
      return b.score - a.score || a.t.n.localeCompare(b.t.n);
    });

    // Keep the top three from turning into one category where possible.
    var picked = [];
    var used = {};
    scored.forEach(function (row) {
      if (picked.length >= 3) return;
      var seen = used[row.t.c] || 0;
      if (seen >= 2) return;
      used[row.t.c] = seen + 1;
      picked.push(row);
    });
    scored.forEach(function (row) {
      if (picked.length < 3 && picked.indexOf(row) === -1) picked.push(row);
    });

    return { top: picked.slice(0, 3), rest: scored.filter(function (r) { return picked.indexOf(r) === -1; }).slice(0, 2) };
  }

  function quizIntro() {
    return '<div class="quiz-intro"><div><h1>Three tools, not forty.</h1>' +
      '<p class="sub">Answer three questions. Every tool on the list is scored against the job, the budget and where you work.</p></div></div>';
  }

  function renderQuiz() {
    var root = $('#quizRoot');
    if (!root) return;

    if (quiz.done) {
      var scored = scoreTools();
      quiz.results = scored.top.map(function (r) { return r.t.id; });
      var allSaved = scored.top.every(function (r) { return saved.has(r.t.id); });
      var jobPhrase = JOB_PHRASE[quiz.answers.job] || 'your brief';
      var pool = TOOLS.filter(function (t) { return (JOB_CATS[quiz.answers.job] || []).indexOf(t.c) > -1; });
      var openMissing = quiz.answers.budget === 'open' && pool.length > 0 && !pool.some(function (t) { return t.p === 'oss'; });

      root.innerHTML = (
        '<div class="result-head"><div><p class="eyebrow">Recommendation / scored</p>' +
        '<h1 tabindex="-1" id="quizTitle">Your three.</h1>' +
        '<p class="sub">Scored for ' + esc(jobPhrase) + ', your budget and where you work. Nothing sponsored, nothing boosted.</p></div>' +
        '<div class="res-actions"><button class="btn btn-ink" type="button" data-save-all' + (allSaved ? ' disabled' : '') + '>' +
        '<svg class="ic ic-sm" aria-hidden="true"><use href="#i-star"/></svg><span>' + (allSaved ? 'All saved' : 'Save all three') + '</span></button>' +
        '<button class="btn btn-line" type="button" data-again>Start over</button></div></div>' +
        scored.top.map(function (r, i) {
          return '<article class="result"><div class="rank"><b>' + pad(i + 1) + '</b></div>' +
            '<div><div class="nm"><a href="' + toolURL(r.t.id) + '">' + esc(r.t.n) + '</a></div>' +
            '<div class="tg">' + esc(r.t.t) + '</div>' +
            '<div class="reasons">' +
            '<span class="reason reason-hot">' + esc(catOf(r.t.c).n) + '</span>' +
            r.why.map(function (w) { return '<span class="reason">' + esc(w) + '</span>'; }).join('') +
            '</div></div>' + saveButton(r.t) + '</article>';
        }).join('') +
        (scored.rest.length ? '<div class="resbar"><span>Also worth a look</span><span>Same brief</span></div>' +
          scored.rest.map(function (r) {
            return '<article class="result"><div class="rank"><b>+</b></div>' +
              '<div><div class="nm"><a href="' + toolURL(r.t.id) + '">' + esc(r.t.n) + '</a></div>' +
              '<div class="tg">' + esc(r.t.t) + '</div></div>' + saveButton(r.t) + '</article>';
          }).join('') : '') +
        '<p class="match-note">Scores weigh the job, the price model and native platform. No sponsored placement in the ranking. ' +
        'Change any answer and the order changes with it.' +
        (openMissing ? ' No open-source tool has earned a place in this job yet, so these are the closest options.' : '') + '</p>'
      );

      var again = $('[data-again]', root);
      if (again) again.addEventListener('click', function () { quiz = { step: 0, answers: {}, done: false, results: [], touched: true }; renderQuiz(); });

      var saveAll = $('[data-save-all]', root);
      if (saveAll) saveAll.addEventListener('click', function () {
        quiz.results.forEach(function (id) { saved.add(id); });
        persistSaved();
        syncSavedUI();
        saveAll.disabled = true;
        saveAll.innerHTML = '<svg class="ic ic-sm" aria-hidden="true"><use href="#i-star"/></svg><span>All saved</span>';
        toast('Three tools saved to your shortlist');
      });

      syncSavedUI();
      if (quiz.touched) {
        var title = $('#quizTitle');
        if (title) title.focus({ preventScroll: true });
      }
      return;
    }

    var q = QUESTIONS[quiz.step];
    var chosen = quiz.answers[q.key];
    root.innerHTML = quizIntro() +
      '<div class="quiz-card"><div class="quiz-head"><span>Question ' + (quiz.step + 1) + ' of 3</span>' +
      '<span class="steps" aria-hidden="true">' + [0, 1, 2].map(function (i) {
        return '<span data-on="' + (i <= quiz.step) + '"></span>';
      }).join('') + '</span></div>' +
      '<div class="quiz-body"><h2 tabindex="-1" id="quizTitle">' + esc(q.q) + '</h2>' +
      '<p class="hint">' + esc(q.hint) + '</p><div class="opts">' +
      q.opts.map(function (o, i) {
        return '<button class="opt" type="button" data-answer="' + q.key + '" data-value="' + o.v + '"' +
          ' aria-pressed="' + (chosen === o.v) + '">' +
          '<span class="k" aria-hidden="true">' + 'ABCDEF'[i] + '</span>' +
          '<span><span class="t">' + esc(o.t) + '</span><span class="d">' + esc(o.d) + '</span></span>' +
          '<svg class="ic ic-sm" aria-hidden="true"><use href="#i-arrow"/></svg></button>';
      }).join('') +
      '</div></div><div class="quiz-foot">' +
      '<button class="link-btn" type="button" data-back' + (quiz.step === 0 ? ' hidden' : '') + '>Back</button>' +
      '<span class="eyebrow">' + (quiz.step === 2 ? 'Then we score the list' : 'Tap an answer to continue') + '</span></div></div>';

    $$('[data-answer]', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        quiz.answers[btn.getAttribute('data-answer')] = btn.getAttribute('data-value');
        if (quiz.step < QUESTIONS.length - 1) quiz.step += 1;
        else quiz.done = true;
        quiz.touched = true;
        renderQuiz();
      });
    });

    var back = $('[data-back]', root);
    if (back) back.addEventListener('click', function () {
      if (quiz.step > 0) quiz.step -= 1;
      quiz.touched = true;
      renderQuiz();
    });

    if (quiz.touched) {
      var title = $('#quizTitle');
      if (title) title.focus({ preventScroll: true });
    }
  }

  function initQuiz() {
    if (!$('#quizRoot')) return;
    renderQuiz();
  }

  /* ---------- boot ---------- */

  function boot() {
    initTheme();
    initHeader();
    initSaveDelegation();
    syncSavedUI();

    if (PAGE === 'browse') initBrowse();
    if (PAGE === 'favorites') initFavorites();
    if (PAGE === 'recommend') initQuiz();

    var year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    $$('[data-tool-count]').forEach(function (n) { n.textContent = String(TOOLS.length); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
