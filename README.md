# NG Shopify Starter

A Dawn-based Shopify theme with a small Vite pipeline for project-specific CSS
and JavaScript.

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

- `src/css/` and `src/js/` contain project-specific source files.
- Vite writes `shopifytheme/assets/custom.css` and
  `shopifytheme/assets/custom.js`.
- The generated custom files are ignored by Git and must not be edited directly.
- Existing Dawn files in `shopifytheme/assets/` remain authored theme assets.
- Both theme layouts load the custom files after Dawn's assets.

Import new CSS from `src/css/index.css` and new JavaScript from
`src/js/index.js`.

## Checks

```bash
npm run format:check
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

Deployment intentionally excludes `templates/*`, `config/*`, `locales/*`,
`snippets/*.json`, and `sections/*.json`. Those files remain managed in Shopify;
the policy is defined only in the `deployment` environment in
`shopifytheme/shopify.theme.toml`, so it does not affect local development.

Do not run `shopify theme pull` unless you intend to reconcile remote theme data
with the local repository.

The original Dawn documentation remains in `shopifytheme/README.md` as upstream
reference material.
