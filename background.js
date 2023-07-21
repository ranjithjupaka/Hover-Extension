function sendAPIRequest(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

const apiUrl = 'https://api.dexscreener.io/latest/dex/search?q=eth'
sendAPIRequest(apiUrl);


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getWords') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ['content.js'],
        },
        function () {
          chrome.tabs.sendMessage(tabId, {
            action: 'highlightWords',
            words: findWordsOnPage(),
          })
        }
      )
    })
  }
})

function findWordsOnPage() {
  const elements = document.getElementsByTagName('*')
  const words = []
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    for (let j = 0; j < element.childNodes.length; j++) {
      const node = element.childNodes[j]
      if (node.nodeType === 3) {
        const text = node.nodeValue
        const regex = /\a([a-zA-Z0-9_]+)/g
        let match
        while ((match = regex.exec(text)) !== null) {
          words.push(match[0])
        }
      }
    }
  }
  return words
}
