module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'block-scoped-var': 2,
    curly: 2,
    eqeqeq: 2,
    'no-redeclare': 2,
    'no-unused-vars': 2,
    'no-use-before-define': 2,
    'no-console': 0,
    'max-len': 0,
    'linebreak-style': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
  globals: {
    fetch: false,
  },
};
