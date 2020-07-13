chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, data => chrome.tabs.sendMessage(tab.id, { src: data }));
});

chrome.runtime.onMessage.addListener(function(message, sender, resp) {
    if (message.action == 'capture') {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, data => resp(data));
        return true;
    }
});