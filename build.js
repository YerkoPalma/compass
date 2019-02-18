const fs = require('fs')
const browserify = require('browserify')
const babelify = require('babelify')

browserify('./index.js')
  .transform(babelify.configure({ presets: [ '@babel/preset-env' ], plugins: [ '@babel/transform-runtime' ] }), { global: true })
  .bundle()
  .pipe(fs.createWriteStream('bundle.js'))
