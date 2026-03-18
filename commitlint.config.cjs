module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'test', 'docs', 'style', 'chore', 'ci', 'perf'],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [0],
  },
};
