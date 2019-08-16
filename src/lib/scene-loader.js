import { StateHandler } from './state-handler'

export class SceneParser {
  /**
   *
   * @param {StateHandler} stateHandler
   */
  constructor (stateHandler) {
    this.stateHandler = stateHandler
    this.cache = new Map()
    this.parser = new DOMParser()
  }

  /**
   * @param {string} url
   * @returns {Promise<Document>}
   */
  loadScene (url) {
    if (!this.cache.has(url)) {
      this.cache.set(url, fetch(url)
        .then(res => res.text())
        .then(text => this.parser.parseFromString(text, 'text/html'))
      )
    }

    return this.cache.get(url)
  }

  /**
   * @param {HTMLElement} target
   * @param {string} url
   */
  render (target, url) {
    this.loadScene(url).then(document => {
      document.querySelectorAll('[data-condition]').forEach(element => {
        element.hidden = !this.stateHandler.hasValue(element.dataset.condition)
      })

      document.querySelectorAll('[data-action]').forEach(element => {
        element.addEventListener('click', event => {
          event.preventDefault()
          this.render(target, element.dataset.action)
        }, { once: true })
      })

      target.innerHTML = ''
      target.append(...document.body.children)
    })
  }
}
