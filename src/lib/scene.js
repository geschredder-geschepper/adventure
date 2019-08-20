const walk = treeWalker => ({
  [Symbol.iterator] () {
    return this
  },

  next () {
    const node = treeWalker.nextNode()
    return node ? { value: node } : { done: true }
  }
})

export class Scene {
  constructor (xml, stateHandler) {
    this.document = new DOMParser().parseFromString(xml, 'application/xml')
    this.stateHandler = stateHandler
  }

  createTreeWalker (root, whatToShow) {
    const shouldReject = node => node.hasAttribute('condition') && !this.stateHandler.test(
      node.getAttribute('condition').split(/\s+/)
    )

    return this.document.createTreeWalker(root, whatToShow + NodeFilter.SHOW_ELEMENT, {
      acceptNode (node) {
        if (!node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT
        }

        if (node instanceof Element) {
          if (shouldReject(node)) {
            return NodeFilter.FILTER_REJECT
          }

          if (node.nodeName === 'fragment') {
            return NodeFilter.FILTER_SKIP
          }
        }

        return NodeFilter.FILTER_ACCEPT
      }
    })
  }

  filter (rootSelector, whatToShow = 0) {
    const root = this.document.querySelector(rootSelector)
    return [...walk(this.createTreeWalker(root, whatToShow))]
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
