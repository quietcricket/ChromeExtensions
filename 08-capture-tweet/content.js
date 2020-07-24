let ele = document.createElement('link');
ele.setAttribute('href', chrome.runtime.getURL('injection.css'));
ele.setAttribute('rel', "stylesheet");
document.body.appendChild(ele);

let alert = document.createElement('div');
alert.id = 'tweet-capture-complete';
alert.className = 'init';
alert.innerHTML = 'Image captured successfully into the clipboard.';
document.body.appendChild(alert);


let topImage;
let bottomImage;
let article;
let articleBounds;

chrome.runtime.onMessage.addListener((message, sender, response) => {
    switch (message.action) {
        case 'adjust-layout':
            adjustLayout();
            break;
    }
});

function adjustLayout() {
    for (let a of document.querySelectorAll('article')) {
        let b = a.getBoundingClientRect();
        if (b.y > 30) {
            article = a;
            break;
        }
    }
    article.style.width = "380px";
    let replyBtn = article.querySelector('a[href^="/compose/tweet"]');
    if (replyBtn) replyBtn.parentNode.parentNode.removeChild(replyBtn.parentNode);

    articleBounds = article.getBoundingClientRect();
    setTimeout(() => {
        chrome.runtime.sendMessage({ action: 'capture' }, parseImage);
    }, 300);
}

function parseImage(data) {
    topImage = document.createElement('img');
    bottomImage = document.createElement('img');
    // Find the bounds of current focusing article
    // If the user never scroll down, the system will take the first article
    // If the user scroll down, especially in home timeline, the system will take the top visible one
    // If the tweet cannot be displayed within the browser, 
    // scroll down the page a bit and capture the remaining part
    // Haven't seen any tweet longer than 2 screen height, it only scroll down once.
    if (articleBounds.height + articleBounds.y > window.innerHeight) {
        window.scrollBy({ left: 0, top: articleBounds.height + articleBounds.y - window.innerHeight });
        bottomImage.onload = drawTweet;
        topImage.onload = function() {
            chrome.runtime.sendMessage({ action: 'capture' }, data => bottomImage.src = data);
        }
    } else {
        topImage.onload = drawTweet;
    }
    topImage.src = data;
}

function drawTweet() {
    let canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.zIndex = 999;
    canvas.width = articleBounds.width * devicePixelRatio;
    canvas.height = articleBounds.height * devicePixelRatio;
    if (bottomImage.src) canvas.getContext('2d').drawImage(bottomImage, -articleBounds.x * devicePixelRatio, (articleBounds.height - window.innerHeight) * devicePixelRatio);
    canvas.getContext('2d').drawImage(topImage, -articleBounds.x * devicePixelRatio, -articleBounds.y * devicePixelRatio);
    canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]));
    // document.body.prepend(canvas);
    article.style.width = '100%';
    alert.className = 'show';
    setTimeout(() => alert.className = '', 3000);
}