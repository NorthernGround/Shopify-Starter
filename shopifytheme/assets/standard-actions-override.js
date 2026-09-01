const DAWN_CART_TAGS = ['cart-drawer', 'cart-items', 'cart-drawer-items', 'cart-notification'];

const DAWN_PUBSUB_REFRESHED_SECTIONS = new Set([
  'cart-drawer:cart-drawer',
  'cart-drawer-items:CartDrawer',
  'cart-items:main-cart-items',
]);

function collectCartSections() {
  const sections = new Map();

  for (const element of document.querySelectorAll(DAWN_CART_TAGS.join(','))) {
    let entries;

    try {
      entries = element.getSectionsToRender?.();
    } catch {
      continue;
    }

    const tag = element.tagName.toLowerCase();

    for (const entry of entries ?? []) {
      if (DAWN_PUBSUB_REFRESHED_SECTIONS.has(`${tag}:${entry.id}`)) continue;

      const sectionId = entry.section ?? entry.id;
      if (!sectionId || sections.has(sectionId)) continue;

      const root = entry.section ? document.getElementById(entry.id) : document;
      if (!root) continue;

      const mount = entry.selector
        ? (root.querySelector(entry.selector) ?? (entry.section ? root : null))
        : document.getElementById(entry.id);
      if (!mount) continue;

      sections.set(sectionId, {
        mount,
        extractSelector: entry.selector || '.shopify-section',
      });
    }
  }

  return sections;
}

async function refreshDawnCartUI() {
  const sections = collectCartSections();
  const sectionsQuery = sections.size ? `?sections=${[...sections.keys()].join(',')}` : '';
  const cartUrl = (typeof routes !== 'undefined' && routes?.cart_url) || '/cart';
  const cartData = await fetch(`${cartUrl}.js${sectionsQuery}`, {
    headers: { Accept: 'application/json' },
  }).then((response) => {
    if (!response.ok) throw new Error(`Cart refresh failed with status ${response.status}`);
    return response.json();
  });

  if (cartData?.sections) {
    for (const [id, { mount, extractSelector }] of sections) {
      const html = cartData.sections[id];
      if (!html) continue;

      const source = new DOMParser().parseFromString(html, 'text/html').querySelector(extractSelector);
      if (source) mount.replaceChildren(...source.childNodes);
    }
  }

  await publish(PUB_SUB_EVENTS.cartUpdate, {
    source: 'external-refresh',
    cartData,
  });
}

function initStandardActions() {
  const actions = window.Shopify?.actions;
  if (!actions) return;

  actions.openCart.configure({
    async handler(defaultHandler) {
      const drawer = document.querySelector('cart-drawer');
      if (drawer && typeof drawer.open === 'function') {
        drawer.open();
        return;
      }

      return defaultHandler();
    },
  });

  actions.updateCart.configure({
    eventTarget: () => document,
    async handler(defaultHandler) {
      const result = await defaultHandler();

      try {
        await refreshDawnCartUI();
      } catch (error) {
        console.error('[Dawn] Standard Actions cart refresh failed; reloading.', error);
        window.location.reload();
      }

      return result;
    },
  });
}

if (window.Shopify?.actions) {
  initStandardActions();
} else {
  document.addEventListener('DOMContentLoaded', initStandardActions, { once: true });
}