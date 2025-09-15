// Delete Swipe Button — ST 1.13.4
// Adds a trash-can icon to each message's ⋯ menu and runs /delswipe.

(function () {
  const ctx = SillyTavern.getContext();
  const { eventSource, event_types } = ctx;

  console.log('[DeleteSwipeButton] loaded (1.13.4)');

  // 1) On app ready, prime existing messages
  eventSource.on(event_types.APP_READY, () => {
    hookAllVisible();
    // 2) When new AI messages render, re-hook
    eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, hookAllVisible);
  });

  // 3) When the user clicks the "⋯" actions button on any message, inject AFTER it opens
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.mes_button.extraMesButtonsHint');
    if (!target) return;
    // Wait a tick so ST can build `.extraMesButtons .mes_buttons`
    setTimeout(() => {
      const panel = findActionsRowFromEllipsis(target);
      if (panel) attachButtonIfMissing(panel);
    }, 0);
  });

  // 4) Safety net: if ST rebuilds the icon row for any reason, re-attach
  const mo = new MutationObserver(() => hookAllVisible());
  mo.observe(document.body, { childList: true, subtree: true });

  // ===== helpers =====

  function hookAllVisible() {
    document.querySelectorAll('.extraMesButtons .mes_buttons').forEach(attachButtonIfMissing);
  }

  function findActionsRowFromEllipsis(ellipsisBtn) {
    // Find the containing message element, then its actions row
    const mes = ellipsisBtn.closest('.mes');
    if (!mes) return null;
    return mes.querySelector('.extraMesButtons .mes_buttons');
  }

  function attachButtonIfMissing(iconRow) {
    if (!iconRow) return;
    if (iconRow.querySelector('[data-st-ext="del-swipe"]')) return;

    // Build an icon entry exactly like ST uses
    const btn = document.createElement('div');
    btn.setAttribute('data-st-ext', 'del-swipe');
    btn.className = 'mes_button fa-solid fa-trash-can interactable';
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('title', 'Delete swipe');

    const onClick = async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      try {
        await runSlash('/delswipe'); // or '/delswipe 2' to delete a specific swipe
        toast(iconRow, 'Swipe deleted');
      } catch (e) {
        console.error('[DeleteSwipeButton] /delswipe failed', e);
        toast(iconRow, 'Failed to delete swipe', true);
      }
    };

    btn.addEventListener('click', onClick);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick(e);
    });

    // Put it first so it's easy to spot
    iconRow.prepend(btn);
  }

  async function runSlash(cmd) {
    // Prefer the public slash-command entry point
    if (window.SlashCommandParser?.parse) {
      return await window.SlashCommandParser.parse(cmd, { quiet: true });
    }
    // Fallback that still respects slash commands
    if (typeof ctx.generateQuietPrompt === 'function') {
      return await ctx.generateQuietPrompt({ quietPrompt: cmd });
    }
    throw new Error('No slash-command entry point found.');
  }

  function toast(where, text, isError = false) {
    const n = document.createElement('div');
    n.textContent = text;
    n.style.fontSize = '.9rem';
    n.style.padding = '4px 8px';
    n.style.borderRadius = '6px';
    n.style.marginTop = '6px';
    n.style.background = isError ? 'rgba(200,40,40,.12)' : 'rgba(40,200,120,.12)';
    n.style.border = isError ? '1px solid rgba(200,40,40,.4)' : '1px solid rgba(40,200,120,.4)';
    where.appendChild(n);
    setTimeout(() => n.remove(), 1400);
  }
})();
