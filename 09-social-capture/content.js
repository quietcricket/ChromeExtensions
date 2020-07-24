let hideElements = ['[href="/compose/tweet"]'];
let imageParts = [];
let article;
let bounds;

let alertBox = document.createElement('div');
document.body.appendChild(alertBox);
initAlert();

function initAlert() {
    alertBox.innerHTML = 'Image captured successfully into the clipboard.';
    let styles = {
        fontFamily: 'system-ui',
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
        padding: '0.7em 1em',
        background: 'rgb(29,161,242)',
        position: 'fixed',
        width: '100%',
        transform: 'translate(0,-100%)',
        textAlign: 'center',
        top: 0,
        zIndex: 10
    };
    for (let k in styles) alertBox.style[k] = styles[k];
    setTimeout(() => alertBox.style.cssText += 'transition:transform 0.5s!important', 100);
}

chrome.runtime.onMessage.addListener((message, sender, response) => {
    article = null;
    let ele = getSelection().getRangeAt(0).startContainer.parentElement;
    // Find the article element
    while (ele.parentNode) {
        if (ele.getAttribute('role') == 'article') {
            article = ele;
            break;
        }
        ele = ele.parentNode;
    }
    // If article element cannot be found, don't do anything
    if (!article) return;
    // Hide elements don't want to show in the screenshots 
    // e.g. hide comment/reply box because it shows the current user's profile photo
    for (let selector of hideElements) {
        article.querySelectorAll(selector).forEach(ele => {
            ele.setAttribute('data-display', ele.style.display);
            ele.style.display = 'none';
        });
    }

    bounds = article.getBoundingClientRect();

    if (bounds.top < 200) window.scrollBy({ left: 0, top: bounds.top - 200 });
    // make it a bit more narrower, closer to mobile view
    article.style.width = document.location.hostname == 'www.facebook.com' ? "500px" : "385px";

    setTimeout(() => {
        bounds = article.getBoundingClientRect();
        imageParts = [{
            bottom: Math.min(bounds.bottom, window.innerHeight),
            height: Math.min(window.innerHeight - bounds.top, bounds.height)
        }];
        imagesLoaded = 0;
        chrome.runtime.sendMessage({ action: 'capture' }, captureImage);
    }, 300);
});

function captureImage(data) {
    let part = imageParts[0];
    part.img = document.createElement('img');
    part.img.className = 'social-capture';
    part.img.src = data;
    part.img.style.left = (imageParts.length - 1) * 420 + 'px';
    part.img.onload = joinImages;
    if (part.bottom == bounds.bottom) return;
    let y = Math.min(innerHeight - 200, bounds.bottom - part.bottom);
    window.scrollBy({ left: 0, top: y });
    imageParts.unshift({ bottom: Math.min(bounds.bottom, part.bottom + y), height: y });
    setTimeout(() => chrome.runtime.sendMessage({ action: 'capture' }, captureImage), 300);
}

function joinImages() {
    // Check if all images are loaded
    for (let part of imageParts) {
        if (!part.img || part.img.width == 0) return;
    }
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let scaling = 2;
    let margin = 2;
    canvas.width = bounds.width * scaling - margin * 2;
    canvas.height = bounds.height * scaling - margin * 2;

    let dw = window.innerWidth * scaling;
    let dh = window.innerHeight * scaling;
    if (imageParts.length == 1) {
        context.drawImage(imageParts[0].img, -bounds.left * scaling - margin, -bounds.top * scaling - margin, dw, dh);
    } else {
        let y = canvas.height;
        for (let part of imageParts) {
            context.drawImage(part.img, -bounds.left * scaling - margin, y - innerHeight * scaling - margin, dw, dh);
            y -= part.height * scaling;
        }
    }
    // Cover the rounded corner 
    if (document.location.host == 'www.facebook.com') {
        let square = 10;
        context.fillStyle = '#fff';
        context.fillRect(0, 0, square, square)
        context.fillRect(canvas.width - square, 0, square, square);
        context.fillRect(0, canvas.height - square, square, square);
        context.fillRect(canvas.width - square, canvas.height - square, square, square);
    }

    // canvas.style.position = 'fixed';
    // canvas.style.zIndex = 999;
    // document.body.prepend(canvas);
    canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]));
    alertBox.style.transform = 'translate(0,0)';
    setTimeout(() => alertBox.style.transform = 'translate(0,-100%)', 3000);

    article.style.width = '100%';
    for (let selector of hideElements) {
        article.querySelectorAll(selector).forEach(ele => {
            ele.style.display = ele.getAttribute('data-display');
        });
    }

}