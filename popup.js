chrome.runtime.sendMessage(
  { action: 'getHighlightedWord' },
  function (response) {
    document.getElementById('word').textContent = response.word
  }
)
