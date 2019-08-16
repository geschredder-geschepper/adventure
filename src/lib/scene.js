export class Scene {
  constructor (xml, stateHandler) {
    this.document = new DOMParser()
      .parseFromString(xml, 'application/xml')
    this.stateHandler = stateHandler
  }

  filter (selector) {
    return Array.from(
      this.document.querySelectorAll(selector)
    ).filter(element => (
      !element.hasAttribute('requires') ||
      this.stateHandler.test(
        element.getAttribute('requires').split(/\s+/)
      )
    ))
  }

  /**
   * @type {string}
   */
  get title () {
    const title = this.document.querySelector('title')
    return title ? title.textContent : ''
  }

  /**
   * @type {Element|null}
   */
  get contents () {
    return this.filter('content')
  }

  get actions () {
    return this.filter('action')
  }
}
