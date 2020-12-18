chrome.contextMenus.create({
    title: "Image Zoom",
    contexts: ["image"],
    id: 'Image Zoom'
});
chrome.contextMenus.onClicked.addListener((info, tab) => chrome.tabs.sendMessage(tab.id, info))