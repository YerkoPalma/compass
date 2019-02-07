/* global screen */
import { html, render } from 'https://unpkg.com/lit-html?module'

var visible = false
export function popup (text) {
  const template = (msg) => html`
    <div class="popup ${visible ? 'popup--show' : ''}">
      <div class="popup__content">
        <div class="popup__contents">
          <div class="popup__inner">
            ${html([msg])}
          </div>
        </div>
        <button @click=${close} class="popup__close" href='#'>close</button>
      </div>
    </div>
    <style>
      .popup {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      
        background-color: rgba(0, 0, 0, 0.8);
      }
      
      .popup.popup--show {
        display: block;
      }
      
        .popup__content {
          max-width: 300px;
          margin: 0 auto;
      
      
          background-color: white;
          color: black;
        }
      
          .popup__contents {
            padding: 1rem;
          }
      
              .popup__inner--hide {
                display: none;
              }
      
          .popup__close {
            display: block;
            padding: 1rem;
            text-align: right;
            width: 100%;
            border: 0;
            background: transparent;
            outline: none;
          }
      
            .popup__close:hover {
              text-decoration: underline;
              cursor: pointer;
            }
    </style>
  `
  let container = document.querySelector('.popup-container')
  if (!container) {
    container = document.createElement('div')
    container.classList.add('popup-container')
    document.body.appendChild(container)
  }
  const close = e => {
    visible = false
    render(template(text), container)
  }
  visible = true
  render(template(text), container)
}

export function getBrowserOrientation () {
  var orientation
  if (screen.orientation && screen.orientation.type) {
    orientation = screen.orientation.type
  } else {
    orientation = screen.orientation ||
                  screen.mozOrientation ||
                  screen.msOrientation
  }

  /*
    'portait-primary':      for (screen width < screen height, e.g. phone, phablet, small tablet)
                              device is in 'normal' orientation
                            for (screen width > screen height, e.g. large tablet, laptop)
                              device has been turned 90deg clockwise from normal
    'portait-secondary':    for (screen width < screen height)
                              device has been turned 180deg from normal
                            for (screen width > screen height)
                              device has been turned 90deg anti-clockwise (or 270deg clockwise) from normal
    'landscape-primary':    for (screen width < screen height)
                              device has been turned 90deg clockwise from normal
                            for (screen width > screen height)
                              device is in 'normal' orientation
    'landscape-secondary':  for (screen width < screen height)
                              device has been turned 90deg anti-clockwise (or 270deg clockwise) from normal
                            for (screen width > screen height)
                              device has been turned 180deg from normal
  */

  return orientation
}
export function decimalToSexagesimal (decimal, type) {
  var degrees = decimal | 0
  var fraction = Math.abs(decimal - degrees)
  var minutes = (fraction * 60) | 0
  var seconds = (fraction * 3600 - minutes * 60) | 0

  var direction = ''
  var positive = degrees > 0
  degrees = Math.abs(degrees)
  switch (type) {
    case 'lat':
      direction = positive ? 'N' : 'S'
      break
    case 'lng':
      direction = positive ? 'E' : 'W'
      break
  }

  return degrees + '° ' + minutes + '\' ' + seconds + '" ' + direction
}
