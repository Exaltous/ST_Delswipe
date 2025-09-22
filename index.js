// DelSwipe Button Extension - Working Version
// Uses the proven method that worked in testing

console.log('[DELSWIPE] Extension starting...');

// Main initialization
function initDelSwipeExtension() {
    console.log('[DELSWIPE] Initializing DelSwipe Button Extension');
    
    // Wait for SillyTavern to be ready
    function waitForST() {
        const chatArea = document.getElementById('send_textarea');
        if (chatArea && document.body) {
            console.log('[DELSWIPE] SillyTavern is ready, creating button');
            createWorkingButton();
        } else {
            console.log('[DELSWIPE] Waiting for SillyTavern to load...');
            setTimeout(waitForST, 1000);
        }
    }
    
    waitForST();
}

// Create the working button using the tested method
function createWorkingButton() {
    console.log('[DELSWIPE] Creating working button');
    
    // Remove existing button
    const existing = document.getElementById('delswipe-working-btn');
    if (existing) {
        existing.remove();
        console.log('[DELSWIPE] Removed existing button');
    }
    
    // Create button with the exact working styling
    const button = document.createElement('button');
    button.id = 'delswipe-working-btn';
    button.innerHTML = '🗑️ Del Swipe';
    button.title = 'Delete current swipe';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        padding: 10px 15px;
        background: var(--SmartThemeBodyColor, #444);
        color: var(--SmartThemeEmColor, white);
        border: 2px solid var(--SmartThemeBorderColor, #666);
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        font-family: inherit;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        user-select: none;
        white-space: nowrap;
    `;
    
    // Add hover effects
    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = 'var(--SmartThemeQuoteColor, #666)';
        button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'var(--SmartThemeBodyColor, #444)';
        button.style.transform = 'scale(1)';
    });
    
    // Use the proven working click handler
    button.onclick = executeDelSwipeWorking;
    
    document.body.appendChild(button);
    console.log('[DELSWIPE] Working button created and added to page');
    
    // Verify button exists
    setTimeout(() => {
        const testBtn = document.getElementById('delswipe-working-btn');
        if (testBtn) {
            console.log('[DELSWIPE] Button confirmed visible on page');
        } else {
            console.log('[DELSWIPE] ERROR: Button not found after creation');
        }
    }, 100);
}

// The proven working execution method
function executeDelSwipeWorking() {
    console.log('[DELSWIPE] Button clicked! Executing delswipe...');
    
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
    if (!document.getElementById('delswipe-working-btn')) {
        console.log('[DELSWIPE] Fallback initialization...');
        initDelSwipeExtension();
    }
}, 3000);

// Method 3: Window load
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!document.getElementById('delswipe-working-btn')) {
            console.log('[DELSWIPE] Window load initialization...');
            initDelSwipeExtension();
        }
    }, 1000);
});

console.log('[DELSWIPE] Extension script loaded');
