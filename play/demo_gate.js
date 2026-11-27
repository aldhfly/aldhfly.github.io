(function () {
  'use strict';

  var GP_URL = 'https://play.google.com/store/apps/details?id=com.dreamexpress.puzzletracks';
  var SAVE_KEY = 'dream_express_save_v123_public';

  function parseLevelNum(text) {
    if (!text) return 0;
    var m = String(text).match(/\d+/);
    return m ? parseInt(m[0], 10) : 0;
  }

  function ensureModal() {
    var existing = document.getElementById('itch-gp-modal');
    if (existing) return existing;

    var dlg = document.createElement('dialog');
    dlg.id = 'itch-gp-modal';
    dlg.setAttribute('closedby', 'any');
    dlg.setAttribute('aria-labelledby', 'itch-gp-modal-title');
    dlg.innerHTML =
      '<div class="demo-gp-modal-card">' +
        '<div class="demo-gp-emoji" aria-hidden="true">🚄⭐⭐⭐</div>' +
        '<h1 id="itch-gp-modal-title" class="demo-gp-title">أكملت النسخة التجريبية! | Demo Complete!</h1>' +
        '<p id="itch-gp-modal-desc" class="demo-gp-desc">' +
          'حمّل اللعبة الكاملة مجاناً الآن على <strong>Google Play</strong> واستمتع بـ <strong>100 مرحلة ثلاثية الأبعاد</strong> عبر <strong>10 عوالم</strong> و<strong>9 قاطرات عالمية</strong> بدون إنترنت!' +
          '<br><span class="demo-gp-sub">Unlock Levels 4–100, Dual-Train Missions, Daily Challenges &amp; 9 Upgradeable Locomotives FREE on Google Play (100% Offline).</span>' +
        '</p>' +
        '<a id="itch-gp-download-link" class="demo-gp-download-btn" href="' + GP_URL + '" target="_blank" rel="noopener">' +
          '📲 Download Full 100-Level Game on Google Play' +
        '</a>' +
        '<form method="dialog" class="demo-gp-close-form">' +
          '<button type="submit" value="replay" class="demo-gp-close-btn" autofocus>' +
            'إعادة لعب المراحل التجريبية (1–3) | Replay Demo (1–3)' +
          '</button>' +
        '</form>' +
      '</div>';

    dlg.addEventListener('close', function () {
      dlg.style.display = '';
      dlg.returnValue = '';
      var prev = dlg._prevFocus;
      dlg._prevFocus = null;
      var active = document.activeElement;
      if (active && dlg.contains(active)) {
        if (prev && prev !== document.body && document.contains(prev) && !prev.closest('[hidden]') && typeof prev.focus === 'function') {
          try { prev.focus({ preventScroll: true }); } catch (_) {}
        }
        if (document.activeElement && dlg.contains(document.activeElement) && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
      }
    });

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      var outside = function (e) {
        var r = dlg.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      var pressedOutside = false;
      dlg.addEventListener('pointerdown', function (e) {
        pressedOutside = outside(e);
      });
      dlg.addEventListener('pointerup', function (e) {
        if (pressedOutside && outside(e) && dlg.open) dlg.close();
      });
    }

    document.body.appendChild(dlg);
    return dlg;
  }

  function showDemoFullGameModal(requestedLevel) {
    var dlg = ensureModal();
    if (!dlg.open) {
      var prev = document.activeElement;
      dlg._prevFocus = (prev && !dlg.contains(prev)) ? prev : null;
    }
    var titleEl = document.getElementById('itch-gp-modal-title');
    if (titleEl) {
      if (requestedLevel && Number(requestedLevel) > 3) {
        titleEl.textContent = 'المرحلة #' + Number(requestedLevel) + ' في النسخة الكاملة | Level #' + Number(requestedLevel) + ' — Full Game';
      } else {
        titleEl.textContent = 'أكملت النسخة التجريبية! | 3-Level Demo Complete!';
      }
    }
    dlg.style.display = 'flex';
    if (!dlg.open && typeof dlg.showModal === 'function') {
      try {
        dlg.showModal();
      } catch (_) {
        dlg.setAttribute('open', '');
      }
    }
  }

  window.__showDemoFullGameModal = showDemoFullGameModal;

  function decorateMapNodes() {
    var list = document.getElementById('stations-list');
    if (list) {
      var nodes = list.querySelectorAll('.level-node-btn');
      for (var i = 0; i < nodes.length; i++) {
        var btn = nodes[i];
        var numEl = btn.querySelector('.level-num');
        var lvlNum = parseLevelNum(numEl ? numEl.textContent : btn.textContent);
        if (lvlNum > 3) {
          btn.disabled = false;
          btn.classList.add('locked', 'demo-locked-node');
          btn.dataset.demoLocked = '1';
          btn.dataset.demoLevel = String(lvlNum);
          btn.setAttribute('aria-label', 'Level ' + lvlNum + ' — Unlock in full game on Google Play');
          var starsMini = btn.querySelector('.level-stars-mini');
          if (starsMini && starsMini.textContent.indexOf('🔒') === -1) {
            starsMini.textContent = '🔒';
          }
        }
      }

      var dockPlayBtns = list.querySelectorAll('[id^="st-dock-play-"]');
      for (var j = 0; j < dockPlayBtns.length; j++) {
        var playBtn = dockPlayBtns[j];
        var sectorId = playBtn.id.replace('st-dock-play-', '');
        var tagEl = document.getElementById('st-dock-tag-' + sectorId);
        var dockLvl = parseLevelNum(tagEl ? tagEl.textContent : '');
        if (dockLvl > 3) {
          playBtn.disabled = false;
          playBtn.dataset.demoLocked = '1';
          playBtn.dataset.demoLevel = String(dockLvl);
        } else {
          delete playBtn.dataset.demoLocked;
          delete playBtn.dataset.demoLevel;
        }
      }
    }

    var tabsBar = document.getElementById('sector-tabs-bar');
    if (tabsBar) {
      var tabs = tabsBar.querySelectorAll('.sector-tab-pill, [data-sector-id], .sector-tab-btn');
      for (var k = 0; k < tabs.length; k++) {
        var tab = tabs[k];
        var rawSid = tab.getAttribute('data-sector-id') || (tab.dataset && tab.dataset.sectorId) || tab.textContent;
        var sid = parseLevelNum(rawSid) || (k + 1);
        if (sid > 1 && !tab.dataset.demoLockBadged && !tab.querySelector('.demo-tab-lock')) {
          tab.dataset.demoLockBadged = '1';
          var badge = document.createElement('span');
          badge.className = 'demo-tab-lock';
          badge.setAttribute('aria-hidden', 'true');
          badge.textContent = ' 🔒';
          tab.appendChild(badge);
        }
      }
    }
  }

  function areDemoLevelsThreeStarred() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      var parsed = JSON.parse(raw);
      var stars = (parsed && parsed.levelStars) || {};
      return (stars[1] || stars['1'] || 0) >= 3 &&
             (stars[2] || stars['2'] || 0) >= 3 &&
             (stars[3] || stars['3'] || 0) >= 3;
    } catch (_) {
      return false;
    }
  }

  document.addEventListener('click', function (e) {
    var target = e.target;
    if (!target || !target.closest) return;

    var lockedNode = target.closest('.level-node-btn[data-demo-locked="1"], [id^="st-dock-play-"][data-demo-locked="1"]');
    if (lockedNode) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showDemoFullGameModal(parseLevelNum(lockedNode.dataset.demoLevel) || 4);
      return;
    }

    var nextBtn = target.closest('#btn-victory-next');
    if (nextBtn) {
      var hudTitle = (document.getElementById('hud-level-title') || {}).textContent || '';
      var vicTitle = (document.getElementById('victory-level-title') || {}).textContent || '';
      var lvl = parseLevelNum(vicTitle) || parseLevelNum(hudTitle);
      if (lvl >= 3) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showDemoFullGameModal(4);
        return;
      }
    }

    var dailyBtn = target.closest('#btn-daily-challenge, #btn-daily-challenge-confirm');
    if (dailyBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showDemoFullGameModal(41);
      return;
    }

    var next3StarBtn = target.closest('#btn-map-next-3star');
    if (next3StarBtn && areDemoLevelsThreeStarred()) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showDemoFullGameModal(4);
      return;
    }
  }, true);

  function hideSimulatedAdSlot() {
    var slot = document.getElementById('admob-banner-slot');
    if (slot) {
      slot.hidden = true;
      slot.style.setProperty('display', 'none', 'important');
    }
  }

  function initObserver() {
    hideSimulatedAdSlot();
    decorateMapNodes();

    var stationsList = document.getElementById('stations-list');
    var tabsBar = document.getElementById('sector-tabs-bar');
    var obs = new MutationObserver(function () {
      decorateMapNodes();
      hideSimulatedAdSlot();
    });
    if (stationsList) obs.observe(stationsList, { childList: true, subtree: true });
    if (tabsBar) obs.observe(tabsBar, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }
})();
