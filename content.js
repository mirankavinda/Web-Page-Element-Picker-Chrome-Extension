
let isPicking = false;

document.addEventListener('click', function(event) {
  if (isPicking) {
    const xpath = getXPath(event.target);
    chrome.runtime.sendMessage({action: 'elementPicked', element: xpath});
    isPicking = false;
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startPicking') {
    isPicking = true;
  }
});

function getXPath(element) {
  if (element.id !== '')
    return 'id("' + element.id + '")';
  if (element === document.body)
    return element.tagName;

  let ix = 0;
  const siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element)
      return getXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
      ix++;
  }
}
