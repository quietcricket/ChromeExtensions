chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({ url: 'https://youtu.be/p9UNlmmz8Cw' });
});

const CONTEXT_MENU_ID = "PRETTY_QUOTE";

function menuClicked(info, tab) {
    if (info.menuItemId !== CONTEXT_MENU_ID) {
        return;
    }
    chrome.tabs.create({
        url: chrome.runtime.getURL('editor.html?q=') + info.selectionText
    });
}
chrome.contextMenus.create({
    title: "Make Quote",
    contexts: ["selection"],
    id: CONTEXT_MENU_ID
});

chrome.contextMenus.onClicked.addListener(menuClicked)