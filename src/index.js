import { StateHandler } from './lib/state-handler'
import { Scene } from './lib/scene'
import './styles/main.scss'

const baseTitle = document.title
const context = require.context('./scenes/', true, /\.xml$/)

const scenes = context.keys().reduce((result, key) => {
  const niceKey = key.replace(/^\W*/, '').replace(/\.\w*$/, '')
  result[niceKey] = new Scene(context(key).default)
  return result
}, {})

const stateHandler = new StateHandler({
  inventory: {},
  scenes: {},
  currentScene: 'entry'
})

const outlet = {
  content: document.getElementById('content')
}

if (window.location.hash) {
  stateHandler.initState()
}

stateHandler.setState({ scenes: { field: true } })

/**
 * @param {Scene} scene
 */
const render = key => {
  const scene = scenes[key]
  const { title, content } = scene

  console.table(stateHandler.state)

  document.title = baseTitle + (title ? ` - ${title}` : '')

  content.querySelectorAll('[requires]').forEach(element => {
    if (!stateHandler.hasValue(
      element.getAttribute('requires')
    )) {
      element.parentNode.removeChild(element)
    }
  })

  outlet.content.innerHTML = `
    <h2>${title}</h2>
    ${content.innerHTML}
  `

  stateHandler.setState({
    scenes: { [key]: true },
    currentScene: key
  })
}

render(stateHandler.state.currentScene)
