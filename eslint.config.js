// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const rdlabo = require('@rdlabo/eslint-plugin-rules');

module.exports = defineConfig([
  {
    ignores: [
      'dist/**',
      'coverage/**',
      '.angular/**',
      'projects/docs/src/app/generated/**',
      'projects/web-site/src/app/generated/**',
      'projects/docs/src/stripe/**',
      'projects/docs/src/stripe-identity/**',
      'projects/docs/src/stripe-terminal/**',
    ],
  },
  {
    plugins: { '@rdlabo/rules': rdlabo },
  },
  ...rdlabo.configs.recommended,
  {
    files: ['projects/docs/src/**/*.ts', 'projects/web-site/src/**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // Signals は導入済みなので、既存の @Input/@ViewChild まで強制変換しない。
      // 代わりに「signal で宣言したものは readonly」に寄せることだけ担保する。
      '@angular-eslint/prefer-signals': [
        'error',
        {
          preferReadonlySignalProperties: true,
          preferInputSignals: false,
          preferQuerySignals: false,
        },
      ],
      // This portal is Angular-only (no Ionic, no ViewModelStore).
      '@rdlabo/rules/ionic-attr-type-check': 'off',
      '@rdlabo/rules/prefer-disable-handler': 'off',
      '@rdlabo/rules/require-viewmodel': 'off',
      '@rdlabo/rules/no-component-method-except-lifecycle': 'off',
    },
  },
  {
    files: ['scripts/**/*.ts'],
    extends: [eslint.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@rdlabo/rules/require-viewmodel': 'off',
      '@rdlabo/rules/no-component-method-except-lifecycle': 'off',
      '@rdlabo/rules/component-property-use-readonly': 'off',
      '@rdlabo/rules/implements-ionic-lifecycle': 'off',
      '@rdlabo/rules/deny-overlay-create': 'off',
      '@rdlabo/rules/prefer-modal-launcher': 'off',
      '@rdlabo/rules/signal-use-as-signal': 'off',
      '@rdlabo/rules/signal-use-as-signal-template': 'off',
      '@rdlabo/rules/restrict-try-block': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@rdlabo/rules/ionic-attr-type-check': 'off',
      '@rdlabo/rules/prefer-disable-handler': 'off',
    },
  },
]);
