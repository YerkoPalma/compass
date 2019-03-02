/* global screen */
import { popup, getBrowserOrientation } from './lib/utils.js'
import './components/web-compass.js'
import './components/app-shell.js'
import './components/web-map.js'

(function () {
  'use strict'

  // info popup elements, pus buttons that open popups
  var btnsPopup = document.querySelectorAll('.btn-popup')

  // buttons at the bottom of the screen
  var btnLockOrientation = document.getElementById('btn-lock-orientation')
  var btnNightmode = document.getElementById('btn-nightmode')
  var btnMap = document.getElementById('btn-map')
  var btnInfo = document.getElementById('btn-info')

  // switches keeping track of our current app state
  var isOrientationLockable = false
  var isOrientationLocked = false
  var isNightMode = false

  // browser agnostic orientation unlock
  function browserUnlockOrientation () {
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock()
    } else if (screen.unlockOrientation) {
      screen.unlockOrientation()
    } else if (screen.mozUnlockOrientation) {
      screen.mozUnlockOrientation()
    } else if (screen.msUnlockOrientation) {
      screen.msUnlockOrientation()
    }
  }

  // browser agnostic document.fullscreenElement
  function getBrowserFullscreenElement () {
    if (typeof document.fullscreenElement !== 'undefined') {
      return document.fullscreenElement
    } else if (typeof document.webkitFullscreenElement !== 'undefined') {
      return document.webkitFullscreenElement
    } else if (typeof document.mozFullScreenElement !== 'undefined') {
      return document.mozFullScreenElement
    } else if (typeof document.msFullscreenElement !== 'undefined') {
      return document.msFullscreenElement
    }
  }

  // browser agnostic document.documentElement.requestFullscreen
  function browserRequestFullscreen () {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen()
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen()
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen()
    }
  }

  // browser agnostic document.documentElement.exitFullscreen
  function browserExitFullscreen () {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }

  function onFullscreenChange () {
    if (isOrientationLockable && getBrowserFullscreenElement()) {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(getBrowserOrientation()).then(function () {
        }).catch(function () {
        })
      }
    } else {
      lockOrientationRequest(false)
    }
  }

  function toggleOrientationLockable (lockable) {
    isOrientationLockable = lockable

    if (isOrientationLockable) {
      btnLockOrientation.classList.remove('btn--hide')

      btnNightmode.classList.add('column-25')
      btnNightmode.classList.remove('column-33')
      btnMap.classList.add('column-25')
      btnMap.classList.remove('column-33')
      btnInfo.classList.add('column-25')
      btnInfo.classList.remove('column-33')
    } else {
      btnLockOrientation.classList.add('btn--hide')

      btnNightmode.classList.add('column-33')
      btnNightmode.classList.remove('column-25')
      btnMap.classList.add('column-33')
      btnMap.classList.remove('column-25')
      btnInfo.classList.add('column-33')
      btnInfo.classList.remove('column-25')
    }
  }

  function checkLockable () {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock(getBrowserOrientation()).then(function () {
        toggleOrientationLockable(true)
        browserUnlockOrientation()
      }).catch(function (event) {
        if (event.code === 18) { // The page needs to be fullscreen in order to call lockOrientation(), but is lockable
          toggleOrientationLockable(true)
          browserUnlockOrientation() // needed as chrome was locking orientation (even if not in fullscreen, bug??)
        } else { // lockOrientation() is not available on this device (or other error)
          toggleOrientationLockable(false)
        }
      })
    } else {
      toggleOrientationLockable(false)
    }
  }

  function lockOrientationRequest (doLock) {
    if (isOrientationLockable) {
      if (doLock) {
        browserRequestFullscreen()
        lockOrientation(true)
      } else {
        browserUnlockOrientation()
        browserExitFullscreen()
        lockOrientation(false)
      }
    }
  }

  function lockOrientation (locked) {
    if (locked) {
      btnLockOrientation.classList.add('active')
    } else {
      btnLockOrientation.classList.remove('active')
    }

    isOrientationLocked = locked
  }

  function toggleOrientationLock () {
    if (isOrientationLockable) {
      lockOrientationRequest(!isOrientationLocked)
    }
  }

  function setNightmode (on) {
    if (on) {
      btnNightmode.classList.add('active')
    } else {
      btnNightmode.classList.remove('active')
    }

    window.setTimeout(function () {
      if (on) {
        document.documentElement.classList.add('nightmode')
      } else {
        document.documentElement.classList.remove('nightmode')
      }
    }, 1)

    isNightMode = on
  }

  function toggleNightmode () {
    setNightmode(!isNightMode)
  }

  function toggleMap () {
    const container = document.querySelector('#appShell')
    // hide current content

    // add next element, hidded
    if (document.querySelector('web-compass')) {
      container.innerHTML = ''
      const map = document.createElement('web-map')
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords
        map.lng = longitude
        map.lat = latitude
        container.appendChild(map)
      }, console.log, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 })
    } else {
      container.innerHTML = ''
      const compass = document.createElement('web-compass')
      container.appendChild(compass)
      compass.watchPosition()
    }

    // show new element
  }

  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('webkitfullscreenchange', onFullscreenChange)
  document.addEventListener('mozfullscreenchange', onFullscreenChange)
  document.addEventListener('MSFullscreenChange', onFullscreenChange)

  btnLockOrientation.addEventListener('click', toggleOrientationLock)
  btnNightmode.addEventListener('click', toggleNightmode)
  btnMap.addEventListener('click', toggleMap)

  var i
  for (i = 0; i < btnsPopup.length; i++) {
    btnsPopup[i].addEventListener('click', e => popup(`<p>
    For best results calibrate the accelerometer in your device by tracing out a figure of 8 in the air several times vertically and horizontally. The heading can also be affected by nearby magnetic fields.
    </p>
    <p>
    For more information, bugs or comments please visit <a href='https://github.com/lamplightdev/compass'>the repo on github</a>.
    </p>`))
  }

  setNightmode(false)
  checkLockable()
}())
