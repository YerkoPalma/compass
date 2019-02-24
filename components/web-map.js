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
      style: 'mapbox://styles/mapbox/streets-v11'
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
