/* global customElements turf */
import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element?module'
import { getBrowserOrientation, popup, decimalToSexagesimal } from '../lib/utils.js'

export default class WebCompass extends LitElement {
  static get properties () {
    return {
      debug: {
        type: Boolean
      },
      hng: {
        type: Number
      },
      phase: {
        type: Number
      },
      lat: {
        type: Number
      },
      lng: {
        type: Number
      },
      targetSvg: {
        type: Object
      }
    }
  }

  constructor () {
    super()
    this.targetSvg = ''
  }
  firstUpdated () {
    if (window.screen.width > window.screen.height) {
      this.defaultOrientation = 'landscape'
    } else {
      this.defaultOrientation = 'portrait'
    }

    window.addEventListener('deviceorientation', event => {
      var heading = event.alpha

      if (typeof event.webkitCompassHeading !== 'undefined') {
        heading = event.webkitCompassHeading // iOS non-standard
      }

      this.orientation = getBrowserOrientation()

      if (typeof heading !== 'undefined' && heading !== null) { // && typeof orientation !== 'undefined') {
        // we have a browser that reports device heading and orientation

        // what adjustment we have to add to rotation to allow for current device orientation
        var adjustment = 0
        if (this.defaultOrientation === 'landscape') {
          adjustment -= 90
        }

        if (typeof orientation !== 'undefined') {
          var currentOrientation = this.orientation.split('-')

          if (this.defaultOrientation !== currentOrientation[0]) {
            if (this.defaultOrientation === 'landscape') {
              adjustment -= 270
            } else {
              adjustment -= 90
            }
          }

          if (currentOrientation[1] === 'secondary') {
            adjustment -= 180
          }
        }

        this.hng = heading + adjustment

        this.phase = this.hng < 0 ? 360 + this.hng : this.hng
      } else {
        // device can't show heading
        // this.showHeadingWarning()
      }
    })
  }
  showHeadingWarning () {
    if (!this.warningHeadingShown) {
      popup(`<p>
      Unfortunately this browser doesn't support orientation so will not show your correct heading.
    </p>`)
      this.warningHeadingShown = true
    }
  }
  watchPosition (marker) {
    navigator.geolocation.watchPosition(({ coords }) => {
      this.lat = coords.latitude
      this.lng = coords.longitude
      if (marker) {
        const { lng, lat } = marker.getLngLat()
        const target = turf.point([lng, lat])
        const current = turf.point([this.lng, this.lat])

        // bearing comes between -180 and 180, so convert to [0, 360]
        const bearing = turf.bearing(current, target) + 180
        const radius = 56
        const center = { x: 65, y: 65 }
        const { x, y } = this.getTargetPosition(bearing, radius, center)
        this.targetSvg = html`<svg x="${x}" y="${y}" version="1.1" preserveAspectRatio="xMidYMid meet" viewBox="0 0 12 17" width="12" height="17"><defs><path d="M0.64 6.44C0.64 11.28 6 16 6 16C6 16 11.36 11.19 11.36 6.44C11.36 3.44 8.97 1 6 1C3.03 1 0.64 3.44 0.64 6.44Z" id="a3B3BcdNT"/></defs><g><g><use xlink:href="#a3B3BcdNT" opacity="1" fill="#edd80b" fill-opacity="1"/><g><use xlink:href="#a3B3BcdNT" opacity="1" fill-opacity="0" stroke="#000000" stroke-width="1" stroke-opacity="0"/></g></g></g></svg>`
      }
    }, err => console.error(err), {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    })
  }

  getTargetPosition (bearing, radius, center) {
    // since Math.tan expect radians, but bearing is in degrees, convert it
    // we know that m = tan(angle), because
    //  angle = tan^-1(m)
    let m = Math.tan(bearing * Math.PI / 180)
    console.log(`m = ${m}`)
    console.log(`bearing = ${bearing}`)
    // we know that x = sqrt(r² / 1 + m²), because
    //  r² = x² + y²    -> Pitagoras
    //  on the other side
    //  m = y2 - y1 / x2 - x1
    //  since our line cross the origin, we can replace x1 and y1 with 0, so
    //  m = y / x
    //  -> y = m * x
    //  replacing in out pitagoras function
    //  r² = x² + m²x²
    //  -> x² * (1 + m²) = r²
    //  -> x² = r² / (1 + m²)
    //  -> x = sqrt(r² / (1 + m²))
    let x = Math.sqrt(radius * radius / (1 + m * m))
    x += center.x
    if (x > 127) x = 127
    if (x < 2.8) x = 2.8
    let y = m * x
    y += center.y
    if (y > 129) y = 129
    if (y < 4.2) y = 4.2
    return { x, y }
  }
  render () {
    return html`
    <style>
    :host [class^="column-"] {
      float: left;
    }
    
      :host .column-33 {
        width: 33%;
      }
    
      :host .column-25 {
        width: 25%;
      }
    
      :host .label {
        font-size: 0.5rem;
      }
    :host .row {
      padding-top: 1.5rem;
    }
    :host .position {
      padding-bottom: 0.5rem;
      text-transform: uppercase;
      text-align: center;
    }
    :host .compass {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
      }
      
      :host .compass__rose {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      
        :host .compass__rose__dial {
            height: 100%;
            width: 100%;
          }
        :host svg {
          overflow: visible;
        }
          :host .compass__pointer {
          height: 100%;
          width: 100%;
        }
    </style>
  <div class="compass">
    <div style="transform: rotateZ(${this.hng}deg); -webkit-transform: rotateZ(${this.hng}deg)" id="rose" class="compass__rose">
      <svg class="compass__rose__dial" viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <circle cx="65" cy="65" r="56" stroke="white" stroke-width="1" fill="none" />
        <polyline points="63,9  67,9  65,13" fill="white" />
        <polyline points="121,63  121,67  119,65" fill="white" />
        <polyline points="63,121  67,121  65,119" fill="white" />
        <polyline points="9,63  9,67  11,65" fill="white" />

        <text x="65" y="4.2" font-size="5" text-anchor="middle" fill="white">W</text>
        <text x="127" y="67" font-size="5" text-anchor="middle" fill="white">N</text>
        <text x="65" y="129" font-size="5" text-anchor="middle" fill="white">E</text>
        <text x="2.8" y="67" font-size="5" text-anchor="middle" fill="white">S</text>

        ${this.targetSvg}
      </svg>

    </div>

    <svg class="compass__pointer" viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg">

      <polyline points="60,60  70,60  65,15" fill="#b60000" />
      <polyline points="60,70  70,70  65,115" fill="white" />
      <circle cx="65" cy="65" r="7" stroke="#b60000" stroke-width="7" fill="none" />

    </svg>

  </div>
  ${this.debug ? html`<div id='debug-orientation-default'>${this.orientation}</div>
  <div id='debug-orientation'>${this.defaultOrientation}</div>` : ''}

  <div class='position row'>
    <div class='column-33'>
      <div class='label'>HDG</div>
      <div id='position-hng'>${this.phase ? (360 - this.phase | 0) + '°' : 'n/a'}</div>
    </div>
    <div class='column-33'>
      <div class='label'>Lat</div>
      <div id='position-lat'>${this.lat ? decimalToSexagesimal(this.lat, 'lat') : 'n/a'}</div>
    </div>
    <div class='column-33'>
      <div class='label'>Lng</div>
      <div id='position-lng'>${this.lng ? decimalToSexagesimal(this.lng, 'lng') : 'n/a'}</div>
    </div>
  </div>`
  }
}

customElements.define('web-compass', WebCompass)
