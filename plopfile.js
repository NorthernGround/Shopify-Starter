const namePattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const normalizeLineEndings = (content) =>
  `${content.replaceAll('\r\n', '\n').replace(/\n*$/, '')}\n`;

const namePrompt = {
  type: 'input',
  name: 'name',
  message: 'Name (kebab-case)',
  validate(value) {
    return namePattern.test(value) || 'Use kebab-case, starting with a letter.';
  },
};

const javascriptPrompt = {
  type: 'confirm',
  name: 'hasJavaScript',
  message: 'Add a custom element?',
  default: false,
};

function javascriptActions() {
  return [
    {
      type: 'add',
      path: 'src/js/components/{{name}}.js',
      templateFile: 'scripts/plop-templates/web-component.js.hbs',
      transform: normalizeLineEndings,
    },
    {
      type: 'modify',
      path: 'src/js/main.js',
      pattern: /(\/\/ plop: js-imports)/,
      template: "import './components/{{name}}.js';\n$1",
    },
  ];
}

export default function configurePlop(plop) {
  plop.setGenerator('section', {
    description: 'Create a Shopify section with registered assets',
    prompts: [
      namePrompt,
      {
        type: 'list',
        name: 'cssPlacement',
        message: 'How should its CSS load?',
        choices: [
          { name: 'Shared main.css bundle', value: 'shared' },
          { name: 'Only when this section renders', value: 'bundle' },
        ],
        default: 'shared',
      },
      javascriptPrompt,
    ],
    actions(data) {
      data.isBundled = data.cssPlacement === 'bundle';

      const actions = [
        {
          type: 'add',
          path: 'shopifytheme/sections/{{name}}.liquid',
          templateFile: 'scripts/plop-templates/section.liquid.hbs',
          transform: normalizeLineEndings,
        },
        data.isBundled
          ? {
              type: 'add',
              path: 'src/css/{{name}}.css',
              templateFile: 'scripts/plop-templates/section.css.hbs',
              transform: normalizeLineEndings,
            }
          : {
              type: 'add',
              path: 'src/css/sections/{{name}}.css',
              templateFile: 'scripts/plop-templates/section.css.hbs',
              transform: normalizeLineEndings,
            },
      ];

      if (data.isBundled) {
        actions.push({
          type: 'modify',
          path: 'vite.config.js',
          pattern: /(    \/\/ plop: vite-entry)/,
          template:
            "    '{{name}}': resolve(import.meta.dirname, 'src/css/{{name}}.css'),\n$1",
        });
      } else {
        actions.push({
          type: 'modify',
          path: 'src/css/main.css',
          pattern: /(\/\* plop: sections \*\/)/,
          template:
            "$1\n@import url('./sections/{{name}}.css') layer(sections);",
        });
      }

      if (data.hasJavaScript) {
        actions.push(...javascriptActions());
      }

      return actions;
    },
  });

  plop.setGenerator('component', {
    description: 'Create a registered project component',
    prompts: [
      namePrompt,
      javascriptPrompt,
      {
        type: 'confirm',
        name: 'hasSnippet',
        message: 'Add a Liquid snippet?',
        default: false,
      },
    ],
    actions(data) {
      const actions = [
        {
          type: 'add',
          path: 'src/css/components/{{name}}.css',
          templateFile: 'scripts/plop-templates/component.css.hbs',
          transform: normalizeLineEndings,
        },
        {
          type: 'modify',
          path: 'src/css/main.css',
          pattern: /(\/\* plop: components \*\/)/,
          template:
            "$1\n@import url('./components/{{name}}.css') layer(components);",
        },
      ];

      if (data.hasSnippet) {
        actions.push({
          type: 'add',
          path: 'shopifytheme/snippets/{{name}}.liquid',
          templateFile: 'scripts/plop-templates/snippet.liquid.hbs',
          transform: normalizeLineEndings,
        });
      }

      if (data.hasJavaScript) {
        actions.push(...javascriptActions());
      }

      return actions;
    },
  });
}
