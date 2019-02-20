const { publish } = require('gh-pages')

publish('.', {
  src: [
    'assets/*',
    'components/*',
    'content/*',
    'lib/*',
    '.nojekyll',
    'CNAME',
    'index.js',
    'bundle.js',
    'service-worker.js',
    'manifest.json',
    'style.css',
    'favicon.ico',
    'index.html'
  ],
  dotfiles: true
}, console.log)
