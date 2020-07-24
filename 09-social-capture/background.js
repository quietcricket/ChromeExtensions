chrome.browserAction.onClicked.addListener(function(tab) {

});

chrome.runtime.onMessage.addListener(function(message, sender, resp) {
    if (message.action == 'capture') {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, data => resp(data));
        return true;
    }
});

function menuClicked(info, tab) {
    chrome.tabs.sendMessage(tab.id, info);
}
chrome.contextMenus.create({
    title: "Capture",
    contexts: ["page", "image", "selection"],
    id: 'SOCIAL-CAPTURE',
    documentUrlPatterns: ['https://twitter.com/*', 'https://www.facebook.com/*']

});

chrome.contextMenus.onClicked.addListener(menuClicked)