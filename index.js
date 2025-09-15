// Delete Swipe Button — ST 1.13.4 (icon-only action in ⋯ menu)
(function () {
  const ctx = SillyTavern.getContext();
  const { eventSource, event_types } = ctx;

  console.log('[DeleteSwipeButton] loaded');

  // Inject when app is ready and whenever a character message renders
  eventSource.on(event_types.APP_READY, hookAllVisible);
  eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, hookLastVisible);

  function hookAllVisible() {
    document.querySelectorAll('.extraMesButtons').forEach(attachButtonIfMissing);
  }
  function hookLastVisible() {
    const panels = document.querySelectorAll('.extraMesButtons');
    if (panels.length) attachButtonIfMissing(panels[panels.length - 1]);
  }

  function attachButtonIfMissing(panel) {
    if (!panel || panel.querySelector('[data-st-ext="del-swipe"]')) return;

    // Create an icon-only action like other ST actions
    const btn = document.createElement('div');
    btn.setAttribute('data-st-ext', 'del-swipe');
    btn.className = 'mes_button fa-solid fa-trash-can interactable'; // matches ST icons
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('title', 'Delete swipe');

    const onClick = async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      try {
        await runSlash('/delswipe'); // or pass an index: '/delswipe 2'
        toast(panel, 'Swipe deleted');
      } catch (e) {
        console.error('[DeleteSwipeButton] /delswipe failed', e);
        toast(panel, 'Failed to delete swipe', true);
      }
    };

    btn.addEventListener('click', onClick);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick(e);
    });

    // Put it near the start so it’s visible
    panel.prepend(btn);
  }

  async function runSlash(cmd) {
    if (window.SlashCommandParser?.parse) {
      return await window.SlashCommandParser.parse(cmd, { quiet: true });
    }
    if (typeof ctx.generateQuietPrompt === 'function') {
      return await ctx.generateQuietPrompt({ quietPrompt: cmd });
    }
    throw new Error('No slash-command entry point found');
  }

  function toast(where, text, isError = false) {
    // minimal inline notice; fine if ST rewrites style attrs
    const n = document.createElement('div');
    n.textContent = text;
    n.setAttribute('custom-style',
      `font-size:.9rem;padding:4px 8px;border-radius:6px;margin-top:6px;` +
      (isError
        ? 'background:rgba(200,40,40,.12);border:1px solid rgba(200,40,40,.4);'
        : 'background:rgba(40,200,120,.12);border:1px solid rgba(40,200,120,.4);')
    );
    where.appendChild(n);
    setTimeout(() => n.remove(), 1400);
  }
})();
