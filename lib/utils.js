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
