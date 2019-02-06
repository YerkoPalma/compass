(function () {
  'use strict'

  let positionCurrent = {
    lat: null,
    lng: null,
    hng: null
  }
  let positionHng = document.getElementById("position-hng")
  let positionLat = document.getElementById("position-lat")
  let rose = document.getElementById("rose")

  window.addEventListener('deviceorientation', event => {
    let heading = event.alpha

    if (typeof event.webkitCompassHeading !== 'undefined') {
      heading = event.webkitCompassHeading //iOS non-standard
    }

    const orientation = getBrowserOrientation()
    positionLat.textContent = heading
    if (typeof heading !== 'undefined' && heading !== null) { // && typeof orientation !== 'undefined') {
      // we have a browser that reports device heading and orientation
      // what adjustment we have to add to rotation to allow for current device orientation
      let adjustment = 0
      if (defaultOrientation === 'landscape') {
        adjustment -= 90
      }

      if (typeof orientation !== 'undefined') {
        let currentOrientation = orientation.split('-')

        if (defaultOrientation !== currentOrientation[0]) {
          if (defaultOrientation === 'landscape') {
            adjustment -= 270
          } else {
            adjustment -= 90
          }
        }

        if (currentOrientation[1] === 'secondary') {
          adjustment -= 180
        }
      }

      positionCurrent.hng = heading + adjustment

      const phase = positionCurrent.hng < 0 ? 360 + positionCurrent.hng : positionCurrent.hng
      positionHng.textContent = (360 - phase | 0) + '°'

      // apply rotation to compass rose
      if (typeof rose.style.transform !== 'undefined') {
        rose.style.transform = 'rotateZ(' + positionCurrent.hng + 'deg)'
      } else if (typeof rose.style.webkitTransform !== 'undefined') {
        rose.style.webkitTransform = 'rotateZ(' + positionCurrent.hng + 'deg)'
      }
    } else {
      // device can't show heading
      positionHng.textContent = 'n/a'
    }
  })

  function getBrowserOrientation () {
    let orientation
    if (screen.orientation && screen.orientation.type) {
      orientation = screen.orientation.type
    } else {
      orientation = screen.orientation ||
                    screen.mozOrientation ||
                    screen.msOrientation
    }
    return orientation
  }
})()
