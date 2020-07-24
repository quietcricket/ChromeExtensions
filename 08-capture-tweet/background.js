chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, { action: 'adjust-layout' });
});

chrome.runtime.onMessage.addListener(function(message, sender, resp) {
    if (message.action == 'capture') {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, data => resp(data));
        return true;
    }
});