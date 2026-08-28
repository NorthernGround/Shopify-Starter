export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['src/css/vendor/dawn/**/*.css'],
  rules: {
    'at-rule-empty-line-before': null,
    'at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['custom-media', 'starting-style'] },
    ],
    'custom-media-pattern': null,
    'custom-property-empty-line-before': null,
    'declaration-empty-line-before': null,
    'declaration-property-value-no-unknown': [
      true,
      { ignoreProperties: { 'interpolate-size': ['allow-keywords'] } },
    ],
    'keyframes-name-pattern': null,
    'no-empty-source': null,
    'property-no-deprecated': null,
    'property-no-vendor-prefix': null,
    'selector-class-pattern': null,
    'selector-pseudo-element-colon-notation': null,
    'value-keyword-case': null,
  },
};
