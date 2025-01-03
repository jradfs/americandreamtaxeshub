module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
    }],
    'react-hooks/exhaustive-deps': 'warn',
    'react/no-unescaped-entities': 'off',
    'no-case-declarations': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-key': 'error'
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "public/"
  ]
}
