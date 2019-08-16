export class Scene {
  constructor (xml) {
    this.document = new DOMParser()
      .parseFromString(xml, 'application/xml')
  }

  /**
   * @type {string}
   */
  get title () {
    const title = this.document.querySelector('title')
    return title ? title.textContent : ''
  }

  /**
   * @type {Element[]}
   */
  get sections () {
    return [...this.document.querySelectorAll('section')]
  }

  /**
   * @type {Element|null}
   */
  get content () {
    const content = this.document.querySelector('content')
    return content && content.cloneNode(true)
  }
}
