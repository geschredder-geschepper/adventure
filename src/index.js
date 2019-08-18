import { StateHandler } from './lib/state-handler'
import { Scene } from './lib/scene'
import './styles/main.scss'

const STATE_PROPS = ['scene', 'inventory']
const baseTitle = document.title
const context = require.context('./scenes/', true, /\.xml$/)

const initialState = STATE_PROPS.reduce((result, current) => {
  result[current] = {}
  return result
}, {
  currentScene: 'entry'
})

const stateHandler = new StateHandler(initialState)

const scenes = context.keys().reduce((result, key) => {
  const niceKey = key.replace(/^\W*/, '').replace(/\.\w*$/, '')
  result[niceKey] = new Scene(context(key).default, stateHandler)
  return result
}, {})

const outlet = {
  content: document.getElementById('content'),
  actions: document.getElementById('actions')
}

if (window.location.hash) {
  stateHandler.initState()
}

const mapDataAttributes = element => STATE_PROPS
  .filter(current => element.hasAttribute(current))
  .map(current => `data-${current}="${element.getAttribute(current)}"`)
  .join('')

/**
 * @param {Scene} scene
 */
const render = () => {
  const { currentScene } = stateHandler.state
  const scene = scenes[currentScene]
  const { title } = scene

  const contents = scene.contents.flatMap(element =>
    element.textContent.split(/\n{2,}/).map(text => `<p>${text}</p>`)
  ).join('')

  const actions = scene.actions.map(element => `
    <li>
      <a
        ${mapDataAttributes(element)}
        class="action"
        href
      >${element.textContent}</a>
    </li>
  `).join('')

  document.title = baseTitle + (title ? ` - ${title}` : '')

  outlet.content.innerHTML = `
    <h2>${title}</h2>
    ${contents}
  `

  outlet.actions.innerHTML = actions

  if (actions) {
    stateHandler.setState({
      scene: { [currentScene]: true }
    })
  } else {
    stateHandler.clearState()
  }
}

render()

document.addEventListener('click', event => {
  const { target } = event

  if (!target.matches('.action')) {
    return
  }

  event.preventDefault()

  if (target.dataset.scene) {
    stateHandler.setState({ currentScene: target.dataset.scene })
  }

  if (target.dataset.inventory) {
    stateHandler.setState({
      inventory: { [target.dataset.inventory]: true }
    })
  }

  render()
})

document.getElementById('restart').addEventListener('click', () => {
  stateHandler.clearState().setState(initialState)
  render()
})
