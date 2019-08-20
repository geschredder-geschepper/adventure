export class Scene {
  constructor (xml, treeWalkerFactory) {
    this.document = new DOMParser().parseFromString(xml, 'application/xml')
    this.treeWalkerFactory = treeWalkerFactory
  }

  filter (rootSelector, whatToShow) {
    const root = this.document.querySelector(rootSelector)
    return [...this.treeWalkerFactory.walk(root, whatToShow)]
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
  get content () {
    return this.filter('content', NodeFilter.SHOW_TEXT)
  }

  get actions () {
    return this.filter('actions')
  }
}
