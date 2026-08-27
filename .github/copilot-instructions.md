# Generic Shopify Theme Development Guide

## Architecture Overview

This Dawn-based Shopify theme uses Shopify CLI for the storefront preview and
Vite for project-specific assets:

- `src/` contains project-specific CSS and JavaScript source.
- `shopifytheme/` contains the Shopify theme and Dawn's authored assets.
- Vite compiles `src/` to the ignored
  `shopifytheme/assets/custom.css` and `custom.js` files.
- Do not edit generated custom assets directly or treat all Dawn assets as Vite
  output.

## Development Workflow

Use the repository-pinned Node and npm versions, then start both processes:

```bash
nvm use
npm ci
npm run dev
```

For the initial store selection, use
`npm run dev:theme -- --store your-store.myshopify.com`. The two underlying
commands are `npm run dev:theme` and `npm run dev:assets`.

## CSS Architecture & Conventions

This project uses **CSS**, not SASS/SCSS. Follow these conventions:

### BEM + Logical Properties Standard

All components follow **strict BEM methodology** with **CSS logical properties**:

```css
/* Correct pattern */
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

Prefer existing Dawn tokens and define project-specific tokens in the custom CSS
source when needed:

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
- **Output**: `shopifytheme/assets/custom.js` and `custom.css`
- **CSS Processing**: Lightning CSS with logical properties support
- **Preview/Reload**: Shopify CLI owns the storefront server and reload behavior

### File Watching

Vite watches `src/**/*` and Shopify CLI watches `shopifytheme/**/*`. Do not add a
second Vite proxy or live-reload layer.

## Environment & Deployment

### Deployment Setup

- Pull requests to `develop` and `main` run `npm run check`.
- Pushes to `develop` deploy through the `development` GitHub Environment.
- Pushes to `main` deploy through the `production` GitHub Environment.
- Deployment-only Shopify flags and ignore patterns live in
  `shopifytheme/shopify.theme.toml`.
- Do not run `shopify theme pull` unless explicitly requested.

### Key Secrets Required

- `SHOPIFY_CLI_THEME_TOKEN`
- `SHOPIFY_STORE_URL` in each GitHub Environment
- `SHOPIFY_CLI_THEME_TOKEN` in each GitHub Environment

Use the same secret names in both environments; environment scoping supplies the
correct values.

## Critical File Dependencies

- `vite.config.js` - Build configuration with LightningCSS
- `src/css/index.css` - CSS entry point and import order
- `src/js/index.js` - JavaScript entry point
- `shopifytheme/layout/theme.liquid` and `password.liquid` - Include built assets

## Common Patterns to Follow

1. **New Components**: Create CSS, Liquid, and JS files with matching BEM class names
2. **Logical Properties**: Always use `inline-size`, `block-size`, `padding-block`, etc.
3. **Web Components**: Prefer for complex interactive elements
4. **Schema Consistency**: Follow project naming conventions and include proper presets
5. **Validation**: Run `npm run check` before handoff
