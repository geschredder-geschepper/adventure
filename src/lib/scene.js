export class Scene {
  constructor (xml, stateHandler) {
    this.document = new DOMParser()
      .parseFromString(xml, 'application/xml')
    this.stateHandler = stateHandler
  }

  filter (selector) {
    return Array.from(
      /** @type {Element[]} */
      (this.document.querySelectorAll(selector))
    ).filter(element => (
      !element.hasAttribute('requires') ||
      this.stateHandler.test(
        element.getAttribute('requires').split(/\s+/)
      )
    )).reduce((result, element) => {
      const closest = element.parentNode.closest(selector)

      if (!closest || result.includes(closest)) {
        result.push(element)
      }

      return result
    }, []).map(element => {
      const clone = element.cloneNode(true)

      clone.querySelectorAll(selector).forEach(
        node => node.parentNode.removeChild(node)
      )

      return clone
    }).filter(node => node.textContent.trim())
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
