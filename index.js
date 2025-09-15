// Delete Swipe Button — ST 1.13.4
// Adds a trash-can icon to each message's ⋯ menu; runs /delswipe.

(function () {
  const ctx = SillyTavern.getContext();
  const { eventSource, event_types } = ctx;

  console.log('[DeleteSwipeButton] loaded');

  // Re-attach on app ready and when new AI messages render
  eventSource.on(event_types.APP_READY, hookAllVisible);
  eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, hookAllVisible);

  // Watch for re-renders of the icon row (.mes_buttons)
  const mo = new MutationObserver(() => hookAllVisible());
  mo.observe(document.body, { childList: true, subtree: true });

  function hookAllVisible() {
    // find each visible icon row inside the per-message actions
    document.querySelectorAll('.extraMesButtons .mes_buttons').forEach(attachButtonIfMissing);
  }

  function attachButtonIfMissing(row) {
    if (!row || row.querySelector('[data-st-ext="del-swipe"]')) return;

    // Make an icon entry exactly like ST's
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
        notify(row, 'Swipe deleted');
      } catch (e) {
        console.error('[DeleteSwipeButton] /delswipe failed', e);
        notify(row, 'Failed to delete swipe', true);
      }
    };
    btn.addEventListener('click', onClick);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick(e);
    });

    // Add at the start so it’s easy to spot
    row.prepend(btn);
  }

  async function runSlash(cmd) {
    if (window.SlashCommandParser?.parse) {
      return await window.SlashCommandParser.parse(cmd, { quiet: true });
    }
    if (typeof ctx.generateQuietPrompt === 'function') {
      return await ctx.generateQuietPrompt({ quietPrompt: cmd });
    }
    throw new Error('No slash-command entry point found.');
  }

  function notify(where, text, isError = false) {
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
