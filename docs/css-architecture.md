# CSS Architecture

## Ownership

`src/css/main.css` is the authored CSS entry point. Vite compiles it to the
ignored `shopifytheme/assets/main.css`; never edit that generated file.

Route- and section-owned entries live beside `main.css`. Load section bundles
from every section that owns their markup; load global behavior bundles from
the layout condition that enables that behavior.

Retained Dawn CSS source lives in `src/css/vendor/dawn/` and is compiled through
the entry graph. It is excluded from project formatting and linting. Dawn
selectors and JavaScript hooks may remain where Shopify behavior depends on
them. New visual rules belong outside the vendor directory, use BEM names, and
prefer logical properties.

## Layers

The cascade order is:

```css
@layer reset, tokens, dawn, base, components, sections, pages, utilities;
```

- `tokens`: raw and semantic design values plus temporary Dawn aliases
- `dawn`: retained structural and behavioral Dawn CSS
- `base`: document, typography, media, and layout defaults
- `components`: reusable controls and content patterns
- `sections`: Shopify section-specific presentation
- `pages`: template-level presentation
- `utilities`: narrow state and accessibility helpers

Custom media definitions live outside a layer. The `--md` and `--lg`
breakpoints match Dawn's 750px and 990px JavaScript contracts.

## Tokens

Components consume semantic tokens such as `--color-surface`, `--color-text`,
`--space-4`, and `--layout-content-max`. Raw palette values stay in
`tokens/color.css`. Add project fonts through `tokens/fonts.css` or update the
family hooks in `tokens/typography.css`.

The root font size is `100%`, normally 16px. All new rem values use that baseline.
Do not use the former Dawn assumption that `1rem` equals 10px.

`tokens/dawn.css` maps the semantic system to variables still consumed by
retained Dawn CSS. Do not use those aliases in new components.

## Theme Editor

Theme Editor settings are for merchant-owned content, information structure,
accessibility, and storefront behavior. Colors, typography, spacing, borders,
radii, shadows, and other visual decisions belong in CSS.

Before removing a setting, replace every Liquid branch or class it controls and
remove stale values from source-controlled defaults. Merchant-managed production
JSON is deliberately excluded from routine deployment.

## Validation

Run:

```bash
npm run check
```

This checks formatting, authored CSS with Stylelint, the Vite build, and Shopify
Theme Check.
