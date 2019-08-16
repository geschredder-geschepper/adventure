import { StateHandler } from './lib/state-handler'
import { Scene } from './lib/scene'
import './styles/main.scss'

// console.log(require('./scenes/entry.xml_'))

const baseTitle = document.title
const context = require.context('./scenes/', true, /\.xml$/)

const scenes = context.keys().reduce((result, key) => {
  const niceKey = key.replace(/^\W*/, '').replace(/\.\w*$/, '')
  result[niceKey] = new Scene(context(key).default)
  return result
}, {})

const stateHandler = new StateHandler()
const game = document.getElementById('game')

if (window.location.hash) {
  stateHandler.initState()
} else {
  stateHandler.setState({
    inventory: {},
    scenes: {},
    currentScene: 'entry'
  })
}

stateHandler.setState({ scenes: { field: true } })

/**
 * @param {Scene} scene
 */
const render = key => {
  const scene = scenes[key]
  const { title, content } = scene

  document.title = baseTitle + (title ? ` - ${title}` : '')

  content.querySelectorAll('[requires]').forEach(node => {
    if (!stateHandler.hasValue(
      node.getAttribute('requires')
    )) {
      node.parentNode.removeChild(node)
    }
  })

  game.innerHTML = `
    <h2>${title}</h2>
    ${content.innerHTML}
  `

  stateHandler.setState({
    scenes: { [key]: true },
    currentScene: key
  })
}

render(stateHandler.state.currentScene)
