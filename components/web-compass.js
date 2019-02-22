/* global customElements */
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
      }
    }
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
        this.showHeadingWarning()
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
  watchPosition () {
    navigator.geolocation.watchPosition(({ coords }) => {
      this.lat = coords.latitude
      this.lng = coords.longitude
    }, err => console.error(err), {
      enableHighAccuracy: false,
      maximumAge: 30000,
      timeout: 27000
    })
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

        <text x="65" y="4.2" font-size="5" text-anchor="middle" fill="white">N</text>
        <text x="127" y="67" font-size="5" text-anchor="middle" fill="white">E</text>
        <text x="65" y="129" font-size="5" text-anchor="middle" fill="white">S</text>
        <text x="2.8" y="67" font-size="5" text-anchor="middle" fill="white">W</text>

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
