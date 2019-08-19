export class Scene {
  constructor (xml, stateHandler) {
    this.document = new DOMParser().parseFromString(xml, 'application/xml')
    this.stateHandler = stateHandler
  }

  walk (rootSelector) {
    const root = this.document.querySelector(rootSelector)
    const { stateHandler } = this

    const treeWalker = this.document.createTreeWalker(root, NodeFilter.SHOW_ALL, {
      acceptNode (node) {
        if (!node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT
        }

        if (node instanceof Element) {
          if (
            node.hasAttribute('condition') &&
            !stateHandler.test(node.getAttribute('condition'))
          ) {
            return NodeFilter.FILTER_REJECT
          }

          if (node.nodeName === 'fragment') {
            return NodeFilter.FILTER_SKIP
          }
        }

        return NodeFilter.FILTER_ACCEPT
      }
    })

    return {
      prev: null,

      [Symbol.iterator] () {
        return this
      },

      next () {
        const node = this.prev instanceof Element
          ? treeWalker.nextSibling()
          : treeWalker.nextNode()

        this.prev = node

        return node ? { value: node } : { done: true }
      }
    }
  }

  filter (selector) {
    return Array.from(
      /** @type {Element[]} */
      (this.document.querySelectorAll(selector))
    ).filter(element => (
      !element.hasAttribute('test') ||
      this.stateHandler.test(
        element.getAttribute('test').split(/\s+/)
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
  get content () {
    return [...this.walk('content')]
  }

  get actions () {
    return [...this.walk('actions')]
  }
}
