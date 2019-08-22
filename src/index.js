import { StateHandler } from './lib/state-handler'
import { TreeWalkerFactory } from './lib/tree-walker-factory'
import { Scene } from './lib/scene'
import './styles/main.scss'

const ACTIONS = ['scene', 'set']
const baseTitle = document.title
const context = require.context('./scenes/', true, /\.xml$/)

const getInitialState = () => ({
  currentScene: 'entry'
})

const stateHandler = new StateHandler(getInitialState())
const treeWalkerFactory = new TreeWalkerFactory(stateHandler)

const scenes = context.keys().reduce((result, key) => {
  const niceKey = key.replace(/^\W*/, '').replace(/\.\w*$/, '')
  result[niceKey] = new Scene(context(key).default, treeWalkerFactory)
  return result
}, {})

const outlet = {
  content: document.getElementById('content'),
  actions: document.getElementById('actions')
}

if (window.location.hash) {
  stateHandler.restore()
}

const mapDataAttributes = element => ACTIONS
  .filter(current => element.hasAttribute(current))
  .map(current => `data-${current}="${element.getAttribute(current)}"`)
  .join('')

const render = () => {
  const { currentScene } = stateHandler.state
  const scene = scenes[currentScene]
  const { title } = scene

  const content = scene.content.flatMap(element =>
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
    ${content}
  `

  outlet.actions.innerHTML = actions

  if (actions) {
    stateHandler.merge({
      scene: { [currentScene]: true }
    })
  } else {
    stateHandler.clear()
  }
}

document.addEventListener('click', event => {
  const { target } = event

  if (!target.matches('.action')) {
    return
  }

  event.preventDefault()

  if (target.dataset.scene) {
    stateHandler.merge({ currentScene: target.dataset.scene })
  }

  if (target.dataset.set) {
    stateHandler.set(target.dataset.set)
  }

  render()
})

document.getElementById('theme').addEventListener('click', () => {
  document.body.classList.toggle('theme-dark')
})

document.getElementById('restart').addEventListener('click', () => {
  stateHandler.clear().merge(getInitialState())
  render()
})

render()
