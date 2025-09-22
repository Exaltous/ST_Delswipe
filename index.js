// DelSwipe Button Extension - Toolbar Integration Version
// Adds DelSwipe to the SillyTavern toolbar menu

console.log('[DELSWIPE] Extension starting...');

// Main initialization
function initDelSwipeExtension() {
    console.log('[DELSWIPE] Initializing DelSwipe toolbar integration');
    
    // Wait for SillyTavern to be ready
    function waitForST() {
        const toolbar = document.querySelector('.toolbar, .mes_buttons, .rightSendForm, .send_form, .right_panel_items');
        const chatArea = document.getElementById('send_textarea');
        
        if (chatArea && document.body) {
            console.log('[DELSWIPE] SillyTavern is ready, adding to toolbar');
            addToToolbar();
        } else {
            console.log('[DELSWIPE] Waiting for SillyTavern to load...');
            setTimeout(waitForST, 1000);
        }
    }
    
    waitForST();
}

// Add DelSwipe to the toolbar menu
function addToToolbar() {
    console.log('[DELSWIPE] Adding DelSwipe to toolbar');
    
    // Remove existing delswipe button
    const existing = document.getElementById('delswipe-toolbar-btn');
    if (existing) {
        existing.remove();
        console.log('[DELSWIPE] Removed existing toolbar button');
    }
    
    // Find the toolbar container - try multiple selectors
    const toolbarSelectors = [
        '.right_panel_items',           // Main toolbar
        '.mes_buttons',                 // Message buttons
        '.send_form .right_panel_items', // Send form toolbar
        '.rightSendForm',               // Alternative toolbar
        '.toolbar',                     // Generic toolbar
        '#rightSendForm'                // ID-based selector
    ];
    
    let toolbar = null;
    for (const selector of toolbarSelectors) {
        toolbar = document.querySelector(selector);
        if (toolbar) {
            console.log(`[DELSWIPE] Found toolbar using selector: ${selector}`);
            break;
        }
    }
    
    if (!toolbar) {
        console.log('[DELSWIPE] No toolbar found, trying to find parent of existing buttons');
        // Try to find toolbar by looking for existing buttons
        const existingBtn = document.querySelector('[title*="Generate"], [title*="Attach"], .mes_button, .right_menu_button');
        if (existingBtn) {
            toolbar = existingBtn.parentElement;
            console.log('[DELSWIPE] Found toolbar via existing button parent');
        }
    }
    
    if (!toolbar) {
        console.log('[DELSWIPE] Could not find toolbar, aborting');
        return;
    }
    
    // Create toolbar button matching the style of existing buttons
    const delSwipeBtn = document.createElement('div');
    delSwipeBtn.id = 'delswipe-toolbar-btn';
    delSwipeBtn.className = 'right_menu_button menu_button fa-solid fa-trash-can';
    delSwipeBtn.title = 'Delete current swipe';
    delSwipeBtn.setAttribute('data-i18n', '[title]Delete Swipe');
    
    // Style to match other toolbar buttons
    delSwipeBtn.style.cssText = `
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        margin: 2px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    `;
    
    // Add hover effect
    delSwipeBtn.addEventListener('mouseenter', () => {
        delSwipeBtn.style.backgroundColor = 'var(--SmartThemeQuoteColor, rgba(255,255,255,0.1))';
    });
    
    delSwipeBtn.addEventListener('mouseleave', () => {
        delSwipeBtn.style.backgroundColor = '';
    });
    
    // Add click handler
    delSwipeBtn.addEventListener('click', executeDelSwipeWorking);
    
    // Insert the button (try to place it near other utility buttons)
    toolbar.appendChild(delSwipeBtn);
    
    console.log('[DELSWIPE] Toolbar button created and added');
    
    // Verify button exists
    setTimeout(() => {
        const testBtn = document.getElementById('delswipe-toolbar-btn');
        if (testBtn && testBtn.offsetParent !== null) {
            console.log('[DELSWIPE] Toolbar button confirmed visible');
        } else {
            console.log('[DELSWIPE] Toolbar button not visible');
        }
    }, 500);
}

// Fallback: Create floating button if toolbar integration fails
function createFloatingButton() {
    console.log('[DELSWIPE] Creating floating fallback button');
    
    const button = document.createElement('button');
    button.id = 'delswipe-floating-fallback';
    button.innerHTML = '🗑️';
    button.title = 'Delete current swipe';
    button.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 10px;
        z-index: 10000;
        padding: 10px;
        background: var(--SmartThemeBodyColor, #444);
        color: var(--SmartThemeEmColor, white);
        border: 2px solid var(--SmartThemeBorderColor, #666);
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    button.addEventListener('click', executeDelSwipeWorking);
    document.body.appendChild(button);
    
    console.log('[DELSWIPE] Floating fallback button created');
}

// The proven working execution method
function executeDelSwipeWorking() {
    console.log('[DELSWIPE] DelSwipe button clicked! Executing...');
    
    const input = document.getElementById('send_textarea');
    if (input) {
        const originalValue = input.value;
        input.value = '/delswipe';
        input.focus();
        
        // Try multiple event approaches
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Try different Enter key variations
        setTimeout(() => {
            // Method 1: KeyboardEvent
            input.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            }));
            
            // Method 2: Try keypress
            setTimeout(() => {
                input.dispatchEvent(new KeyboardEvent('keypress', {
                    key: 'Enter',
                    keyCode: 13,
                    bubbles: true
                }));
                
                // Method 3: Try clicking send button if it exists
                setTimeout(() => {
                    const sendBtn = document.getElementById('send_but') || 
                                   document.querySelector('[title*="Send"], [title*="send"], .send_button, #send_button');
                    if (sendBtn) {
                        console.log('[DELSWIPE] Found send button, clicking it');
                        sendBtn.click();
                    }
                }, 50);
            }, 50);
        }, 50);
        
        console.log('[DELSWIPE] Command execution attempted');
    } else {
        console.log('[DELSWIPE] ERROR: Could not find chat input');
    }
}

// Multiple initialization attempts
console.log('[DELSWIPE] Setting up initialization...');

// Method 1: DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDelSwipeExtension);
} else {
    setTimeout(initDelSwipeExtension, 100);
}

// Method 2: Delayed fallback
setTimeout(() => {
    if (!document.getElementById('delswipe-toolbar-btn')) {
        console.log('[DELSWIPE] Fallback initialization...');
        initDelSwipeExtension();
    }
}, 3000);

console.log('[DELSWIPE] Extension script loaded');
