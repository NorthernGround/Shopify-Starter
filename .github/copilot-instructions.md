# Generic Shopify Theme Development Guide

## Architecture Overview

This is a modern Shopify theme built with **Vite + Shopify CLI dual-terminal workflow**. The codebase is organized with:

- `src/` - Modern development files (CSS, JS) built by Vite
- `shopifytheme/` - Shopify theme structure (Liquid templates, assets)
- **Dual Build Process**: Vite compiles `src/` → `shopifytheme/assets/` while Shopify CLI serves the theme

## Development Workflow

**Critical**: Always run both terminals simultaneously:

```bash
# Terminal 1: Shopify theme development server
cd shopifytheme
shopify theme dev --store <your-shopify-url>

# Terminal 2: Vite asset compilation
yarn dev  # runs: cross-env NODE_ENV=development vite + vite build --watch
```

## CSS Architecture & Conventions

This project uses **CSS**, not SASS/SCSS. Follow these conventions: 

### BEM + Logical Properties Standard

All components follow **strict BEM methodology** with **CSS logical properties**:

```css
/* ✅ Correct Pattern */
.featured-campaign__bg {
  inline-size: 100%; /* not width */
  block-size: 100vh; /* not height */
  padding-block: 2rem; /* not padding-top/bottom */
  margin-inline: auto; /* not margin-left/right */
  inset-block-start: 0; /* not top */
}
```

### Component Structure

- **CSS**: `src/css/components/[component-name].css`
- **Liquid**: `shopifytheme/sections/[component-name].liquid`
- **JS**: `src/js/components/[component-name].js` (if needed)

**Import Pattern**: All CSS imported through `src/css/index.css` - add new components there.

### CSS Custom Properties System

Use the established design token system from `src/css/theme/variables.css`:

```css
:root {
}
```

## JavaScript Patterns

### Modern Web Components Approach

For interactive components, use **Custom Elements** pattern like `marquee-banner.js`:

```javascript
class ComponentName extends HTMLElement {
  connectedCallback() {
    /* setup */
  }
  disconnectedCallback() {
    /* cleanup */
  }
}
customElements.define('component-name', ComponentName);
```

Import and initialize in `src/js/index.js`.

## Shopify Section Patterns

### Schema Structure

All custom sections follow this naming and schema pattern:

```liquid
{% schema %}
{
  "name": "Generic [Component Name]",
  "tag": "section",
  "class": "section",
  "settings": [/* settings array */],
  "blocks": [/* blocks if repeatable content */],
  "presets": [{"name": "Generic [Component Name]"}]
}
{% endschema %}
```

### Accessibility Requirements

- Use semantic HTML with proper ARIA labels
- Implement `prefers-reduced-motion` for animations
- Include `aria-hidden="true"` for decorative duplicated content
- Add `role` attributes for landmark sections

## Build System Details

### Vite Configuration Specifics

- **Entry Point**: `src/js/index.js`
- **Output**: Single bundle → `shopifytheme/assets/main.js`
- **CSS Processing**: Lightning CSS with logical properties support
- **Proxy**: Development server proxies to Shopify CLI (port 9292)

### File Watching

Vite watches `src/**/*` and Shopify CLI watches `shopifytheme/**/*` - changes trigger appropriate rebuilds.

## Environment & Deployment

### Multi-Environment Setup

The theme uses Shopify environment settings for script loading:

1. Add Developer schema to Shopify admin (not deployed via Git)
2. Set environment in theme customizer: Development/Staging/Production
3. Follow branching strategy: develop → staging → main

### Key Secrets Required

- `SHOPIFY_CLI_THEME_TOKEN`
- `SHOPIFY_STORE_URL`

Refer to `docs/deployment.png` for branching workflow.

## Critical File Dependencies

- `vite.config.js` - Build configuration with LightningCSS
- `src/css/index.css` - CSS entry point and import order
- `src/js/index.js` - JavaScript entry point
- `shopifytheme/layout/theme.liquid` - Include built assets

## Common Patterns to Follow

1. **New Components**: Create CSS, Liquid, and JS files with matching BEM class names
2. **Logical Properties**: Always use `inline-size`, `block-size`, `padding-block`, etc.
3. **Web Components**: Prefer for complex interactive elements
4. **Schema Consistency**: Follow project naming conventions and include proper presets
