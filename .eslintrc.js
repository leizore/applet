
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'standard'
  ],
  globals: {
    Component: true,
    getCurrentPage: true,
    wx: true,
    getCurrentPages: true,
    Page: true,
    getApp: true
  },
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
