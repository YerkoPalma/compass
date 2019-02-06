/* global navigator customElements */
import AppShell from './components/app-shell.js'

// register components
customElements.define('app-shell', AppShell)

// Register service worker
navigator.serviceWorker
  .register('service-worker.js', { updateViaCache: 'none' })
