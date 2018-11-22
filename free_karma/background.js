
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  try{
  chrome.tabs.executeScript(tab.ib, {
		file: 'main.js'
  });
  }finally{
    
  }
})

