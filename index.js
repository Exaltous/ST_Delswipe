// Extension-DeleteSwipeButton / index.js
// Adds a "Delete swipe" action to each AI message's ⋯ menu and runs /delswipe.
// Tested against ST 1.12.x selectors; tweak selectors if your theme changes DOM.

(function () {
  const ctx = SillyTavern.getContext(); // public extension context (events, helpers, etc.)
  const { eventSource, event_types } = ctx;

  // When the app is ready, and whenever a character (AI) message is rendered, try to attach our action.
  eventSource.on(event_types.APP_READY, () => hookAllVisible());
  eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, () => addButtonToLatest());

  function hookAllVisible() {
    document.querySelectorAll(messageSelector()).forEach(attachButtonIfMissing);
  }
  function addButtonToLatest() {
    const nodes = document.querySelectorAll(messageSelector());
    if (nodes.length) attachButtonIfMissing(nodes[nodes.length - 1]);
  }

  // --- Selectors (kept a bit flexible across skins/builds) ---
  function messageSelector() {
    // Assistant/character messages (not user)
    return '.mes[is_user="false"], .mes[is_user=false], .mes.bot, .mes.character';
  }
  function actionsContainerOf(messageEl) {
    // The per-message “⋯ Message actions” container
    return (
      messageEl.querySelector('.message-actions') ||
      messageEl.querySelector('[data-st-role="message-actions"]')
    );
  }

  function attachButtonIfMissing(messageEl) {
    const panel = actionsContainerOf(messageEl);
    if (!panel) return;

    // Avoid duplicates
    if (panel.querySelector('[data-st-ext="del-swipe"]')) return;

    // Build the action item
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-st-ext', 'del-swipe');
    btn.className = 'st-action';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '0.4rem';

    const ico = document.createElement('span');
    ico.textContent = '🗑️';
    const label = document.createElement('span');
    label.textContent = 'Delete swipe';

    btn.append(ico, label);

    btn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      try {
        await runSlash('/delswipe'); // deletes CURRENT swipe (optional index: "/delswipe 2")
        toast(panel, 'Swipe deleted');
      } catch (e) {
        console.error('[DeleteSwipeButton] /delswipe failed', e);
        toast(panel, 'Failed to delete swipe', true);
      }
    });

    // Put it near the top so it’s easy to find
    panel.prepend(btn);
  }

  async function runSlash(cmd) {
    // Prefer the public slash-command parser if available.
    if (window.SlashCommandParser?.parse) {
      // quiet = don't echo to chat
      return await window.SlashCommandParser.parse(cmd, { quiet: true });
    }
    // Fallback: generateQuietPrompt respects slash commands in most builds
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
