module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "@typescript-eslint/no-explicit-any": "off",
    "vue/no-multiple-template-root": "off",
    "vue/no-v-model-argument": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-deprecated-slot-attribute": "off",
    "@typescript-eslint/ban-types": "off",
  }
}
