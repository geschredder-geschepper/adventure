import { StateHandler } from './lib/state-handler'
import { Scene } from './lib/scene'
import './styles/main.scss'

const baseTitle = document.title
const context = require.context('./scenes/', true, /\.xml$/)

const stateHandler = new StateHandler({
  inventory: {},
  scenes: {},
  currentScene: 'entry'
})

const scenes = context.keys().reduce((result, key) => {
  const niceKey = key.replace(/^\W*/, '').replace(/\.\w*$/, '')
  result[niceKey] = new Scene(context(key).default, stateHandler)
  return result
}, {})

const outlet = {
  content: document.getElementById('content'),
  actions: document.getElementById('actions')
}

// if (window.location.hash) {
//   stateHandler.initState()
// }

/**
 * @param {Scene} scene
 */
const render = key => {
  const scene = scenes[key]
  const { title } = scene

  const contents = scene.contents.map(element => `
    <p>${element.innerHTML}</p>
  `).join('')

  const actions = scene.actions.map(element => `
    <li>
      <a
        data-scene="${element.getAttribute('scene')}"
        class="action"
        href
      >${element.textContent}</a>
    </li>
  `).join('')

  console.table(stateHandler.state)

  document.title = baseTitle + (title ? ` - ${title}` : '')

  outlet.content.innerHTML = `
    <h2>${title}</h2>
    ${contents}
  `

  outlet.actions.innerHTML = actions

  stateHandler.setState({
    scenes: { [key]: true },
    currentScene: key
  })
}

render(stateHandler.state.currentScene)

document.addEventListener('click', event => {
  const { target } = event

  if (!target.matches('.action')) {
    return
  }

  event.preventDefault()

  if (target.dataset.scene) {
    render(target.dataset.scene)
  }
})
