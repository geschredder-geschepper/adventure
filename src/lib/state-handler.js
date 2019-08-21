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

  restore () {
    try {
      this.state = decode(window.location.hash.slice(1))
    } catch (error) {
      console.warn('Invalid state', error)
    }

    return this
  }

  merge (state) {
    merge(this.state, state)

    window.history.replaceState(
      this.state,
      document.head.title,
      '#' + encode(this.state)
    )

    return this
  }

  clear () {
    this.state = {}

    window.history.replaceState(
      this.state,
      document.head.title,
      '.'
    )

    return this
  }

  set (path) {
    const state = path.split('.').reduceRight((value, key) => ({
      [key]: value
    }), true)

    return this.merge(state)
  }

  get (path) {
    return path.split('.').reduce((result, current) => {
      return (
        result && has(result, current)
      ) ? result[current] : undefined
    }, this.state)
  }

  test (conditions) {
    return conditions.split(/\s+/).every(condition => {
      return condition[0] === '!'
        ? this.get(condition.slice(1)) === undefined
        : this.get(condition) !== undefined
    })
  }
}
