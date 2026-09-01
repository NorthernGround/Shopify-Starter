# CSS Architecture

## Ownership

`src/css/main.css` is the primary storefront entry point. Vite compiles it to
the ignored `shopifytheme/assets/main.css`; never edit that generated file.

`src/css/foundation.css` contains only contracts shared by the storefront,
password, and gift-card documents: layers, tokens, document defaults,
typography, branding, text helpers, and core utilities. Components belong to
the entry graphs that use them. The password and gift-card entries import their
required project components explicitly instead of carrying the full storefront.

Route- and section-owned entries live beside `main.css`. Load section bundles
from every section that owns their markup; load global behavior bundles from
the layout condition that enables that behavior.

Retained Dawn CSS source lives in `src/css/vendor/dawn/` and is compiled through
the entry graph. It is excluded from project formatting and linting. There is
no Dawn global or standalone base stylesheet; global foundations and shared
components are project-owned. Dawn selectors and JavaScript hooks may remain
where Shopify behavior depends on them. New visual rules belong outside the
vendor directory, use BEM names, and prefer logical properties.

## Layers

The cascade order is:

```css
@layer reset, tokens, dawn, base, components, sections, pages, utilities;
```

- `tokens`: raw and semantic design values
- `dawn`: migrated Dawn foundations followed by retained structural and
  behavioral Dawn CSS
- `base`: project document and typography defaults
- `components`: reusable controls and content patterns
- `sections`: Shopify section-specific presentation
- `pages`: template-level presentation
- `utilities`: narrow state and accessibility helpers

File ownership and cascade placement are separate concerns. Rules extracted
from Dawn's former base stylesheets live in project `base`, `components`,
`sections`, and `utilities` directories, but remain in the `dawn` layer before
retained Dawn imports. This preserves the original specificity relationship:
retained component selectors can override generic helpers. New project styling
uses the later layer matching its ownership.

Custom media definitions live outside a layer. The `--md` and `--lg`
breakpoints match Dawn's 750px and 990px JavaScript contracts.

## Tokens

Components consume semantic tokens such as `--color-surface`, `--color-text`,
`--space-4`, and `--layout-content-max`. Raw palette values stay in
`tokens/color.css`. Add project fonts through `tokens/fonts.css` or update the
family hooks in `tokens/typography.css`.

The root font size is `100%`, normally 16px. All new rem values use that baseline.
Do not use the former Dawn assumption that `1rem` equals 10px.

Typography uses fixed project tokens. Do not add body or heading scale custom
properties or merchant heading-size settings. The `.h1` through `.h5` classes
mirror their semantic heading levels; do not extend that heading utility set.
Semantic heading elements are styled by `base/typography.css`; component
typography belongs to the component that owns it.

Retained Dawn CSS consumes the same semantic tokens as project-owned CSS. Keep
visual decisions in the owning token file rather than adding compatibility
aliases.

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
