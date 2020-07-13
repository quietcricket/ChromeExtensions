let ele = document.createElement('link');
ele.setAttribute('href', chrome.runtime.getURL('injection.css'));
ele.setAttribute('rel', "stylesheet");
document.body.appendChild(ele);

let alert = document.createElement('div');
alert.id = 'tweet-capture-complete';
alert.className = 'init';
alert.innerHTML = 'Image captured successfully into the clipboard.';
document.body.appendChild(alert);

function getBounds() {
    for (let a of document.querySelectorAll('article')) {
        let b = a.getBoundingClientRect();
        if (b.y > 0) return b;
    }
}

let img1 = document.createElement('img');
let img2;
let bounds;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    bounds = getBounds();
    if (bounds.height > window.innerHeight) {
        window.scrollBy({ left: 0, top: bounds.height - window.innerHeight });
        img1.onload = function() {
            chrome.runtime.sendMessage({ action: 'capture', tab: message.tab }, data => {
                img2 = document.createElement('img');
                img2.onload = drawImages;
                img2.src = data;
            });
        }

    } else {
        img2 = null;
        img1.onload = drawImages;
    }
    img1.src = message.src;
});

function drawImages() {
    let canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.zIndex = 999;
    canvas.width = bounds.width * devicePixelRatio;
    let margin = document.location.pathname.indexOf('/status/') > -1 ? 50 : 0;
    canvas.height = (bounds.height - margin) * devicePixelRatio;
    if (img2) canvas.getContext('2d').drawImage(img2, -bounds.x * devicePixelRatio, (bounds.height - window.innerHeight - bounds.y) * devicePixelRatio);
    canvas.getContext('2d').drawImage(img1, -bounds.x * devicePixelRatio, -bounds.y * devicePixelRatio);
    canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]));
    // document.body.prepend(canvas);
    alert.className = 'show';
    setTimeout(() => alert.className = '', 3000);
}