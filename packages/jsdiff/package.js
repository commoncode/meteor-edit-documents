Package.describe({
  summary: 'JS Diff'
});

Npm.depends({
    diff: "1.0.8",
});

Package.on_use(function(api) {

  api.export('JsDiff');

  api.add_files([
    'diff-server.js'
  ], 'server');

  api.add_files([
    '.npm/package/node_modules/diff/diff.js'
  ], 'client');
});
