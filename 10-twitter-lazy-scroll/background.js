chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({ url: 'https://www.youtube.com/watch?v=BcvMVjxOIxA' });
});