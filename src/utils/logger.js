/**
 * Centralized User Action & Console Logger
 * 
 * Provides:
 * 1. Rich, formatted console.log outputs in the Browser Developer Tools (F12 -> Console).
 * 2. Comprehensive click listener covering ALL elements (buttons, links, images, cards, text).
 * 3. Auto-clears console after 200 entries so DevTools never freezes on re-open.
 */

let _logCount = 0;
const MAX_LOGS = 200; // Auto-clear after this many logs to keep DevTools fast

export function logClientAction(action, details = null) {
  // Auto-clear console when it gets too large (keeps DevTools open fast)
  _logCount++;
  if (_logCount > MAX_LOGS) {
    console.clear();
    _logCount = 1;
    console.log('%c[NovaStore] Console auto-cleared (kept under 200 entries for DevTools speed)', 'color:#94a3b8;font-size:11px;');
  }

  const timestamp = new Date().toLocaleTimeString();

  // Log to Browser Developer Tools Console with styled badges
  if (details !== null && details !== undefined) {
    console.log(
      `%c[NovaStore %c${timestamp}%c] ⚡ ${action}`,
      "color: #f59e0b; font-weight: bold;",
      "color: #94a3b8; font-weight: normal; font-size: 11px;",
      "color: #38bdf8; font-weight: bold;",
      details
    );
  } else {
    console.log(
      `%c[NovaStore %c${timestamp}%c] ⚡ ${action}`,
      "color: #f59e0b; font-weight: bold;",
      "color: #94a3b8; font-weight: normal; font-size: 11px;",
      "color: #38bdf8; font-weight: bold;"
    );
  }
}


/**
 * Initializes a global click listener so ANY element clicked on the page
 * produces immediate console output showing the element, its function or why it didn't trigger an action.
 */
export function initGlobalClickListener() {
  if (typeof window === "undefined" || window.__novastore_click_listener_installed) {
    return;
  }
  window.__novastore_click_listener_installed = true;

  window.addEventListener(
    "click",
    (event) => {
      try {
        const target = event.target;
        if (!target) return;

        const tag = target.tagName.toLowerCase();
        const interactive = target.closest(
          "button, a, input, select, textarea, [role='button'], .cursor-pointer"
        );

        if (interactive) {
          const itag = interactive.tagName.toLowerCase();
          const label =
            interactive.innerText?.trim() ||
            interactive.getAttribute("aria-label") ||
            interactive.getAttribute("title") ||
            interactive.getAttribute("placeholder") ||
            interactive.id ||
            interactive.className?.slice?.(0, 30) ||
            "element";

          const cleanLabel = label.replace(/\s+/g, " ").slice(0, 50);

          logClientAction(`[Click Action: <${itag}>] "${cleanLabel}"`, {
            tag: itag,
            id: interactive.id || "(none)",
            type: interactive.getAttribute("type") || "(none)",
            href: interactive.getAttribute("href") || undefined,
            status: "FUNCTION_TRIGGERED",
          });
        } else {
          // Element clicked has no interactive handler attached
          const text = (target.innerText?.trim() || target.getAttribute("alt") || target.className || "")
            .replace(/\s+/g, " ")
            .slice(0, 40);

          const card = target.closest(".group");
          const tip = card
            ? "Tip: You clicked inside a product card. Click the product image, title, or '+ Cart' / 'Details' button to trigger an action."
            : "Note: This element has no click listener attached.";

          logClientAction(`[DOM Click: <${tag}>] "${text || tag}"`, {
            tag,
            class: target.className ? String(target.className).slice(0, 50) : "(none)",
            status: "NO_DIRECT_HANDLER",
            guidance: tip,
          });
        }
      } catch (err) {
        // Fallback
      }
    },
    true
  );
}
