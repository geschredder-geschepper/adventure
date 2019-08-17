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
    )).filter((element, index, array) => {
      const closest = element.parentNode.closest(selector)
      return closest ? array.includes(closest) : true
    }).map(element => {
      const clone = element.cloneNode(true)

      clone.querySelectorAll(selector).forEach(predecessor => {
        predecessor.parentNode.removeChild(predecessor)
      })

      return clone
    })
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
