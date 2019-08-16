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

  initState () {
    try {
      this.state = decode(window.location.hash.slice(1))
    } catch (error) {
      console.warn('Invalid state', error)
      this.state = {}
    }

    return this
  }

  setState (state) {
    merge(this.state, state)

    window.history.replaceState(
      state,
      document.head.title,
      '#' + encode(this.state)
    )

    return this
  }

  hasValue (path) {
    if (path[0] === '!') {
      return !this.hasValue()
    }

    return path.split('.').reduce((result, current) => {
      return (
        result && has(result, current)
      ) ? result[current] : undefined
    }, this.state) !== undefined
  }
}
