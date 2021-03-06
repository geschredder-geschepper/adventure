export class Scene {
  /**
   * @param {string}
   * @param {TreeWalkerFactory}
   */
  constructor (xml, treeWalkerFactory) {
    this.document = new DOMParser().parseFromString(xml, 'application/xml')
    this.treeWalkerFactory = treeWalkerFactory
  }

  /**
   * @param {string} rootSelector
   * @param {number} whatToShow
   * @returns {Node[]}
   */
  filter (rootSelector, whatToShow) {
    const root = this.document.querySelector(rootSelector)
    return [...this.treeWalkerFactory.walk(root, whatToShow)]
  }

  /**
   * @type {string}
   */
  get title () {
    const [title] = this.filter('title', NodeFilter.SHOW_TEXT)
    return title ? title.textContent : ''
  }

  /**
   * @type {Element[]}
   */
  get content () {
    return this.filter('content', NodeFilter.SHOW_TEXT)
  }

  /**
   * @type {Element[]}
   */
  get actions () {
    return this.filter('actions')
  }
}
