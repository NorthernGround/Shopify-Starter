# Generic Shopify Theme Development Guide

## Architecture Overview

This Dawn-based Shopify theme uses Shopify CLI for the storefront preview and
Vite for project-specific assets:

- `src/` contains project-specific CSS and JavaScript source.
- `shopifytheme/` contains the Shopify theme and Dawn's authored assets.
- Vite compiles `src/` to ignored `main.css`, `main.js`, and route bundles in
  `shopifytheme/assets/`.
- Do not edit generated custom assets directly or treat all Dawn assets as Vite
  output.
- The custom CSS system owns visual design; retained Dawn assets provide
  storefront behavior and compatibility during migration.

## Development Workflow

Use the repository-pinned Node and npm versions, then start both processes:

```bash
nvm use
npm ci
npm run dev
```

Use `npm run new` to scaffold project sections and components. Preserve the
`plop:` registration markers in shared entry files.

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

**Import Pattern**: Shared CSS is imported through `src/css/main.css`; route and
section bundles are direct entries in `vite.config.js`.

### CSS Custom Properties System

Use semantic project tokens from `src/css/tokens/`. New CSS must not reference
Theme Editor visual settings or introduce component-specific raw colors:

```css
:root {
  --color-surface: var(--color-neutral-0);
}
```

The root font size is `100%`; author rem values against the browser-default 16px
baseline. Do not restore Dawn's `62.5%` root convention.

Declare shared CSS through the layer order in `src/css/main.css`. New components
belong in the `components` or `sections` layer. Dawn compatibility aliases are
only for retained Dawn selectors.

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

Import and initialize in `src/js/main.js`.

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

- **Entry Point**: `src/js/main.js` plus route CSS entries in `vite.config.js`
- **Output**: `shopifytheme/assets/main.js`, `main.css`, and route CSS bundles
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
- `src/css/main.css` - shared CSS entry point and import order
- `src/js/main.js` - JavaScript entry point
- `shopifytheme/layout/theme.liquid` and `password.liquid` - Include built assets
- `docs/css-architecture.md` - CSS ownership and Theme Editor setting policy

## Common Patterns to Follow

1. **New Components**: Create CSS, Liquid, and JS files with matching BEM class names
2. **Logical Properties**: Always use `inline-size`, `block-size`, `padding-block`, etc.
3. **Web Components**: Prefer for complex interactive elements
4. **Schema Consistency**: Follow project naming conventions and include proper presets
5. **Theme Settings**: Keep content, structure, accessibility, and behavior controls; visual decisions belong in CSS
6. **Validation**: Run `npm run check` before handoff
