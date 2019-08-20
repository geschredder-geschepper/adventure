export class TreeWalkerFactory {
  constructor (stateHandler) {
    this.stateHandler = stateHandler
  }

  shouldReject (node) {
    return node.hasAttribute('condition') && !this.stateHandler.test(
      node.getAttribute('condition').split(/\s+/)
    )
  }

  create (root, whatToShow) {
    return document.createTreeWalker(root, whatToShow + NodeFilter.SHOW_ELEMENT, {
      acceptNode: node => {
        if (!node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT
        }

        if (node instanceof Element) {
          if (this.shouldReject(node)) {
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

  walk (root, whatToShow = 0) {
    const treeWalker = this.create(root, whatToShow)

    return {
      [Symbol.iterator] () {
        return this
      },

      next () {
        const node = treeWalker.nextNode()
        return node ? { value: node } : { done: true }
      }
    }
  }
}
