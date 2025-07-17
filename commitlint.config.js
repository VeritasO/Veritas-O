module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'header-pattern': [2, 'always', '^\\[(JUNO|MIRRA|LYRA|VESTA|TEMPUS|POLYMNIA)\\] .+'],
    'header-pattern-explanation': [
      2,
      'always',
      'Commit message must start with [JUNO], [MIRRA], [LYRA], [VESTA], [TEMPUS], or [POLYMNIA]'
    ],
  },
};