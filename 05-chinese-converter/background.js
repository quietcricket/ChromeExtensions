
const CONTEXT_ID = "CHINESE_CONVERTER";

chrome.contextMenus.create({ title: "简↔繁", contexts: ["selection"], id: CONTEXT_ID });

chrome.contextMenus.onClicked.addListener((info, tab) => chrome.tabs.sendMessage(tab.id, { 'action': info.menuItemId }))

chrome.action.onClicked.addListener(() => chrome.tabs.create({ url: 'https://youtu.be/CgPMtsk41Kk' }));