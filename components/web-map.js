/* global customElements mapboxgl */
import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element?module'

export default class WebMap extends LitElement {
  static get properties () {
    return {
      lat: {
        type: Number
      },
      lng: {
        type: Number
      }
    }
  }
  updated (changedProperties) {
  }
  createRenderRoot () {
    return this
  }
  firstUpdated () {
    mapboxgl.accessToken = 'pk.eyJ1IjoieWVya29wYWxtYSIsImEiOiJjaXRrMzJyaTMwOXN2MnRta3kxdWl3eTJlIn0.Uksl2kszTnSQW3PFAMYTJg'
    var map = new mapboxgl.Map({ // eslint-disable-line
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 13,
      center: [ this.lng, this.lat ]
    })
    map.on('load', function (e) {
      if (window.marker) window.marker.addTo(map)
    })
    map.on('click', function (e) {
      if (window.marker) window.marker.remove()
      window.marker = new mapboxgl.Marker({
        draggable: true
      })
        .setLngLat(e.lngLat)
        .addTo(map)
    })
  }
  render () {
    return html`
    <style>
      #map {
        height: 100%;
      }
    </style>
    <div id="map"></div>`
  }
}
customElements.define('web-map', WebMap)
