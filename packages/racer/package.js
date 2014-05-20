Package.describe({
  summary: 'Racer'
});

Npm.depends({
    racer: "0.6.0-alpha1",
});

Package.on_use(function(api) {

  api.add_files([
    'racer.js'
  ], 'server');

});
