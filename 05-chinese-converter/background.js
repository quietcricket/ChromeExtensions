chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({ url: 'https://youtu.be/CgPMtsk41Kk' });
});

const CONTEXT_ID = "CHINESE_CONVERTER";

function menuClicked(info, tab) {
    chrome.tabs.sendMessage(tab.id, { 'action': info.menuItemId });
}
chrome.contextMenus.create({
    title: "简↔繁",
    contexts: ["selection"],
    id: CONTEXT_ID
});

chrome.contextMenus.onClicked.addListener(menuClicked)