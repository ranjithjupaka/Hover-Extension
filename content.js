chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'highlightWords') {
    const words = request.words
    words.forEach(function (word) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      const elements = document.getElementsByTagName('*')
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        for (let j = 0; j < element.childNodes.length; j++) {
          const node = element.childNodes[j]
          if (node.nodeType === 3) {
            const text = node.nodeValue
            const replacedText = text.replace(regex, function (matched) {
              return `<span class="highlighted">$${matched.substring(1)}</span>`
            })
            if (replacedText !== text) {
              const newNode = document.createElement('span')
              newNode.innerHTML = replacedText
              element.replaceChild(newNode, node)
            }
          }
        }
      }
    })
  }
})

document.addEventListener('mouseover', function (event) {
  if (event.target.matches('.highlighted')) {
    const word = event.target.innerText
    const popup = document.createElement('div')
    popup.classList.add('popup')
    popup.textContent = word
    event.target.appendChild(popup)
  }
})

document.addEventListener('mouseout', function (event) {
  if (event.target.matches('.highlighted')) {
    const popup = event.target.querySelector('.popup')
    popup.remove()
  }
})

chrome.runtime.sendMessage({ action: 'getWords' })
