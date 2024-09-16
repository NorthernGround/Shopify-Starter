# NG Shopify Starter Project

## Get Started

Install the CLI

- `brew install shopify`

Make sure to use Node version 18

- `nvm use 18`

## Get Running

Terminal 1

```bash
cd shopifytheme
shopify theme dev --store <your shopify url>
```

Terminal 2

```bash
yarn install
yarn dev
```

## Environments

In addition to Node environments, we also use Shopify environments for script loading. Steps below:

1. Add the schema directly to in the code editor on Shopify - it is done this way because the deployment action does not upload anything under /config


```bash
  {
    "name": "Developer",
    "settings": [
      {
        "label": "Environment",
        "id": "environment",
        "type": "select",
        "options": [
          {
            "label": "Development",
            "value": "development"
          },
          {
            "label": "Staging",
            "value": "staging"
          },
          {
            "label": "Production",
            "value": "production"
          }
        ],
        "default": "production"
      }
    ]
  },
```

2. Navigate to your theme > customize > settings and change the environment to `Staging` or `Production` 

## Get Deploying

- Change secrets in github repo to your shopify url, and your [api access key](https://shopify.dev/docs/apps/auth/admin-app-access-tokens)

![required keys](https://github.com/NorthernGround/shopifydev/blob/develop/docs/keys.png?raw=true)

- Follow the deployment branching strategy

![deployment diagram](https://github.com/NorthernGround/shopifydev/blob/develop/docs/deployment.png?raw=true)
