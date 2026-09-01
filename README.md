# NG Shopify Starter

A Dawn-based Shopify theme with a small Vite pipeline for project-specific CSS
and JavaScript.

Upstream compatibility baseline: Shopify Dawn 16.0.0.

## Requirements

- Node.js 24.14.x
- npm 11.9.x
- A Shopify account with permission to manage themes

The Shopify CLI is installed locally with the project. A global installation is
not required.

## Setup

```bash
nvm use
npm ci
npm run build
```

On the first run, connect Shopify CLI to a store:

```bash
npm run dev:theme -- --store your-store.myshopify.com
```

Shopify CLI opens the browser for authentication when required and remembers the
selected store for later commands.

## Development

Start Shopify CLI and the Vite asset watcher together:

```bash
npm run dev
```

To run the processes separately:

```bash
# Terminal 1
npm run dev:theme

# Terminal 2
npm run dev:assets
```

Use the preview URL printed by Shopify CLI. Shopify CLI watches Liquid and the
compiled assets; Vite watches files under `src/`.

## Asset Ownership

- `src/css/` owns the theme's design tokens, custom visual system, and retained
  Dawn CSS source under `src/css/vendor/dawn/`.
- `src/js/` contains project-specific JavaScript.
- Vite writes `shopifytheme/assets/main.css`, `main.js`, and route- or
  section-owned CSS bundles.
- Generated bundle files are ignored by Git and must not be edited directly.
- Retained Dawn runtime assets provide storefront behavior and compatibility;
  Vite compiles retained Dawn CSS from `src/css/vendor/dawn/`.
- Storefront, password, and gift-card pages load the custom stylesheet.

Import new CSS from `src/css/main.css` and new JavaScript from
`src/js/main.js`.

Scaffold and register a new project section or component interactively:

```bash
npm run new
```

The section generator can add styles to the shared bundle or create a Vite
bundle loaded only when that section renders. It can also register an optional
custom element. The component generator can add an optional Liquid snippet and
custom element.

Review retained assets that have no direct reference in the theme source:

```bash
npm run audit:assets
```

The audit is report-only. Treat its output as removal candidates because some
Shopify assets can be referenced dynamically.

The theme uses a browser-default 16px rem baseline. See
`docs/css-architecture.md` for the layer order, token contract, and Theme Editor
setting policy.

## Checks

```bash
npm run format:check
npm run lint:css
npm run theme:check
npm run build
npm run check
```

`npm run check` runs all required CI checks. Theme Check fails on errors while
still reporting the inherited Dawn warnings.

Use `npm run format` to format project-owned source, configuration, workflows,
and documentation. The imported Dawn theme is intentionally excluded from bulk
formatting.

## Deployment

Pull requests targeting `develop` or `main` run the CI workflow. Pushes deploy as
follows:

- `develop` uses the `development` GitHub Environment.
- `main` uses the `production` GitHub Environment.
- The deployment workflow can also be run manually for either environment.

Create both GitHub Environments and add these environment-scoped secrets to
each:

- `SHOPIFY_STORE_URL`
- `SHOPIFY_CLI_THEME_TOKEN`

Configure required reviewers on the `production` environment to add a production
approval gate. Deployments run the full check suite, serialize per environment,
and push to the live theme with Shopify CLI's strict validation enabled.

Deployment ships `config/settings_schema.json`, locale/schema translations, and
the fixed `templates/product.json`, but excludes merchant-owned
`config/settings_data.json`, other templates, `snippets/*.json`, and
`sections/*.json`. The policy is defined only in the
`deployment` environment in `shopifytheme/shopify.theme.toml`, so it does not
affect local development.

Do not run `shopify theme pull` unless you intend to reconcile remote theme data
with the local repository.

The original Dawn documentation remains in `shopifytheme/README.md` as upstream
reference material.
