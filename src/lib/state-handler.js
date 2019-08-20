const encode = object => window.btoa(JSON.stringify(object))
const decode = string => JSON.parse(window.atob(string))
const has = (object, property) => Object.prototype.hasOwnProperty.call(object, property)

const merge = (dest, src) => Object.keys(src).reduce((result, key) => {
  result[key] = (
    typeof src === 'object' &&
    typeof result[key] === 'object'
  ) ? merge(result[key], src[key]) : src[key]

  return result
}, dest)

export class StateHandler {
  constructor (initialState) {
    this.state = initialState
  }

  restoreState () {
    try {
      this.state = decode(window.location.hash.slice(1))
    } catch (error) {
      console.warn('Invalid state', error)
    }

    return this
  }

  setState (state) {
    merge(this.state, state)

    window.history.replaceState(
      this.state,
      document.head.title,
      '#' + encode(this.state)
    )

    return this
  }

  clearState () {
    this.state = {}

    window.history.replaceState(
      this.state,
      document.head.title,
      '.'
    )

    return this
  }

  test (path) {
    if (Array.isArray(path)) {
      return path.every(current => this.test(current))
    }

    if (path[0] === '!') {
      return !this.test(path.slice(1))
    }

    return path.split('.').reduce((result, current) => {
      return (
        result && has(result, current)
      ) ? result[current] : undefined
    }, this.state) !== undefined
  }
}
