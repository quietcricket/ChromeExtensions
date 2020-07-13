class ReaderMode {
    constructor() {
        chrome.storage.local.get(['autoMode'], data => {
            if (!data.autoMode) return;
            for (let url of data.autoMode.split(',')) {
                if (document.location.href.indexOf(url) == 0) {
                    this.toggle();
                    return;
                }
            }
        });
    }
    toggle() {
        if (document.querySelector('iframe#readermode')) {
            document.body.removeChild(document.querySelector('iframe#readermode'));
            document.body.style.overflow = 'auto';
            return;
        }
        var documentClone = document.cloneNode(true);
        var article = new Readability(documentClone).parse();
        chrome.storage.local.set({ html: article.content, title: article.title, url: document.location.href });
        let iframe = document.createElement('iframe');
        iframe.id = 'readermode';
        iframe.src = chrome.runtime.getURL('reader.html');
        iframe.style.width = "100%";
        iframe.style.height = "100vh";
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.display = "block";
        document.body.appendChild(iframe);
        document.body.style.overflow = 'hidden';
        let zindex = 1;
        document.querySelectorAll('div,footer,nav,header').forEach(ele => {
            let z = parseInt(getComputedStyle(ele).zIndex);
            if (!isNaN(z)) zindex = Math.max(zindex, z);
        });
        iframe.style.zIndex = zindex + 10;
    }
}

let __readerMode = new ReaderMode();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    __readerMode.toggle();
});