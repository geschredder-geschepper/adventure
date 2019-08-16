/**
 * Animate text
 * @param {HTMLElement} target
 * @param {string} text
 */
export const animateText = (target, text, delay = 0) => {
  target.innerHTML = ''
  text.split('').map(character => Object.assign(
    document.createElement('span'),
    { textContent: character }
  )).reduce((chain, span) => chain.then(() => new Promise(resolve => {
    target.appendChild(span)
    window.setTimeout(resolve, delay)
  })), Promise.resolve())
}
