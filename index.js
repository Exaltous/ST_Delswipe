// Delete Swipe Button (ST 1.13.4)
// Adds a "Delete swipe" action into each AI message's ⋯ menu and runs /delswipe.

(function () {
  const ctx = SillyTavern.getContext();
  const { eventSource, event_types } = ctx;

  console.log('[DeleteSwipeButton] loaded');

  // Hook: once app is ready + whenever a character (AI) message renders
  eventSource.on(event_types.APP_READY, () => hookAllVisible());
  eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, () => addButtonToLatest());

  function hookAllVisible() {
    document.querySelectorAll(messageSelector()).forEach(attachButtonIfMissing);
  }

  function addButtonToLatest() {
    const nodes = document.querySelectorAll(messageSelector());
    if (nodes.length) attachButtonIfMissing(nodes[nodes.length - 1]);
  }

  // Target AI/character messages (not user)
  function messageSelector() {
    return '.mes[is_user="false"], .mes[is_user=false], .mes.bot, .mes.character';
  }

  // ST 1.13.x uses `.extraMesButtons` for the per-message actions panel
  function actionsContainerOf(messageEl) {
    return (
      messageEl.querySelector('.extraMesButtons') ||   // 1.13.x
      messageEl.querySelector('.message-actions') ||   // fallback
      messageEl.querySelector('[data-st-role="message-actions"]')
    );
  }

  function attachButtonIfMissing(messageEl) {
    const panel = actionsContainerOf(messageEl);
    if (!panel) return;

    // avoid duplicates
    if (panel.querySelector('[data-st-ext="del-swipe"]')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-st-ext', 'del-swipe');
    btn.className = 'st-action';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '0.4rem';

    const ico = document.createElement('span');
    ico.textContent = '🗑️'; // wastebasket emoji
    const label = document.createElement('span');
    label.textContent = 'Delete swipe';

    btn.append(ico, label);

    btn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      try {
        await runSlash('/delswipe'); // deletes CURRENT swipe; pass an index like "/delswipe 2" if desired
        toast(panel, 'Swipe deleted');
      } catch (e) {
        console.error('[DeleteSwipeButton] /delswipe failed', e);
        toast(panel, 'Failed to delete swipe', true);
      }
    });

    // put near the top of the menu for visibility
    panel.prepend(btn);
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

  function toast(where, text, isError = false) {
    const n = document.createElement('div');
    n.textContent = text;
    n.style.fontSize = '0.9rem';
    n.style.padding = '4px 8px';
    n.style.borderRadius = '6px';
    n.style.marginTop = '6px';
    n.style.background = isError ? 'rgba(200,40,40,.12)' : 'rgba(40,200,120,.12)';
    n.style.border = isError ? '1px solid rgba(200,40,40,.4)' : '1px solid rgba(40,200,120,.4)';
    where.appendChild(n);
    setTimeout(() => n.remove(), 1400);
  }
})();
