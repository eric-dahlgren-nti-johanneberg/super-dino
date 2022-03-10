module.exports = {
  extends: ["typescript", "typescript/prettier"],
  plugins: ["filenames", "jest"],
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  rules: {
    "filenames/no-index": "error",
    "filenames/match-exported": ["error", "kebab"],
    "jest/no-disabled-tests": "error",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/valid-expect": "error",
  },
};
