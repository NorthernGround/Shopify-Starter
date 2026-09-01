# Shopify Theme Instructions

## Toolchain and Validation

- Use the versions pinned by `.nvmrc` and `package.json`: Node 24.14 and npm 11.9.
- Install dependencies with `npm ci`.
- Run `npm run check` before handoff. It checks formatting, authored CSS,
  the Vite build, and Shopify Theme Check.
- Do not assume unit-test, JavaScript-lint, or typecheck commands exist.

## Development and Asset Ownership

- Run the storefront and asset watchers together with `npm run dev`. For the
  initial store selection, use
  `npm run dev:theme -- --store your-store.myshopify.com`.
- Use `npm run new` to scaffold project sections and components, and preserve
  the `plop:` registration markers in shared entry files.
- Author project CSS and JavaScript in `src/`.
- Never edit generated files in `shopifytheme/assets/` that correspond to Vite
  entries in `src/css/` or `src/js/`.
- Import shared CSS through `src/css/main.css` and project JavaScript through
  `src/js/main.js`. Route- or section-owned CSS bundles are direct Vite entries
  in `vite.config.js`; keep their source in `src/css/`.
- Vite only builds configured entries and files reachable from their import
  graphs.
- Keep `src/css/foundation.css` limited to styles shared by the storefront,
  password, and gift-card documents. Import components explicitly from each
  entry that uses them.
- Retained Dawn CSS source lives in `src/css/vendor/dawn/`; do not add raw CSS
  source to `shopifytheme/assets/`.
- Do not reintroduce Dawn global or standalone base stylesheets. Project base,
  component, section, and utility folders own those extracted contracts.
- Treat non-CSS files in `shopifytheme/assets/` as retained Dawn runtime assets
  unless they correspond to a Vite output.
- Do not bulk-format retained Dawn source; vendor CSS is intentionally excluded
  from Prettier and Stylelint.
- Shopify CLI owns storefront preview and reload. Do not add another Vite proxy
  or live-reload layer.

## CSS

- This project uses CSS, not Sass or SCSS. Follow `docs/css-architecture.md`.
- Use BEM names for new project-owned selectors. Preserve Dawn selectors and
  JavaScript hooks where Shopify behavior depends on them.
- Use logical properties such as `inline-size`, `block-size`, `padding-block`,
  `margin-inline`, and logical inset properties.
- Consume semantic tokens from `src/css/tokens/`. Keep raw palette values in
  `tokens/color.css`; do not introduce component-specific raw colors.
- Retained Dawn CSS consumes project semantic tokens directly; do not add
  compatibility aliases for vendor variable names.
- The root font size is `100%`. Author rem values against the browser-default
  16px baseline; do not restore Dawn's former 62.5% convention.
- Do not add body or heading font-scale tokens or merchant heading-size
  settings. `.h1` through `.h5` mirror their semantic heading levels using the
  fixed typography tokens; do not add additional heading-size utilities.
- Preserve the cascade order declared in `src/css/main.css`. Explicitly import
  new component and section styles into the matching `components` or `sections`
  layer; directory placement alone does not assign a layer.
- Keep rules extracted from Dawn's former base stylesheets in the `dawn` layer
  before retained Dawn imports. Their project-owned directory does not move
  them above the retained selectors they were designed to yield to.
- Keep visual decisions such as colors, typography, spacing, borders, radii,
  and shadows in CSS. Theme Editor settings for new work should control merchant
  content, information structure, accessibility, or storefront behavior.

## JavaScript

- Prefer a Custom Element for substantial new project-owned interactions and
  clean up listeners, observers, and timers in `disconnectedCallback`.
- Import project-owned modules from `src/js/main.js`.
- When extending retained Dawn behavior, preserve its custom-element contracts,
  selectors, events, and data attributes unless the task explicitly replaces
  them.
- Respect `prefers-reduced-motion` for new animation and motion effects.

## Liquid and Sections

- Put project section templates in `shopifytheme/sections/` and snippets in
  `shopifytheme/snippets/`; use matching BEM names for their project-owned CSS.
- Follow the nearest Dawn section's schema conventions. Include a preset when a
  section should be addable in the Theme Editor; do not force a fixed schema
  name, tag, or class where the surrounding pattern differs.
- Preserve Shopify translation keys, `block.shopify_attributes`, editor hooks,
  and Liquid branches that control retained Dawn behavior.
- Keep responsive `image_tag` widths and sizes accurate when changing media.
- Use semantic HTML and preserve keyboard behavior, focus handling, labels,
  live regions, and `aria-hidden="true"` on decorative duplicate content.
- Before removing a Theme Editor setting, replace every Liquid branch or class
  it controls and remove stale values from source-controlled defaults.

## Deployment Safety

- Never run `shopify theme pull` unless the user explicitly requests it; it can
  overwrite local theme changes.
- Never run `npm run deploy` or `shopify theme push` unless the user explicitly
  requests a deployment.
- Do not casually change deployment ignores in `shopifytheme/shopify.theme.toml`.
  Merchant settings data, templates, and section/snippet JSON are intentionally
  excluded from routine deployment.
- See `README.md` for branch mappings, environment configuration, required
  secrets, and deployment behavior.
