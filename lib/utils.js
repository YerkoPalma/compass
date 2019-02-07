import { html, render } from 'https://unpkg.com/lit-html?module'
export function popup (text, el = '.popup') {
  const container = document.querySelector(el)
  const close = e => {
    container.classList.remove('popup--show')
    container.querySelector('.popup__inner').classList.add('popup__inner--hide')
  }
  const template = (msg) => html`
    <div id="popup-content" class="popup__content">
      <div id="popup-contents" class="popup__contents">
        <div class="popup__inner popup__inner--hide">
          ${html([msg])}
        </div>
      </div>
      <button @click=${close} class="popup__close" href='#'>close</button>
    </div>`
  render(template(text), container)
  container.classList.add('popup--show')
  container.querySelector('.popup__inner').classList.remove('popup__inner--hide')
}
