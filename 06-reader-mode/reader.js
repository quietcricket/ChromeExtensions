let FONTS = {
    'Geogia': 'Georgia,"Times New Roman", Times, serif',
    'Arial': 'Arial, Helvetica, sans-serif',
    'Lucida Sans': '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    'Tahoma': 'Tahoma, Geneva, sans-serif',
    'Trebuchet': '"Trebuchet MS", Helvetica, sans-serif',
    'Verdana': 'Verdana, Geneva, sans-serif'
};

let SETTINGS_DEFAULT = { 'width': 700, 'fontSize': 22, 'fontFamily': FONTS['Geogia'], 'autoMode': '', 'lineHeight': '1.5', html: '', title: '', url: '' };
let inner = document.querySelector('.readermode-inner');
let urls = [];
let currUrl = '';

function cleanImages() {
    setTimeout(() => {
        for (let img of document.querySelectorAll('img')) {
            if (img.getAttribute('data-src')) img.setAttribute('src', img.getAttribute('data-src'));
            if (img.getAttribute('datasrc')) img.setAttribute('src', img.getAttribute('datasrc'));
            if (img.getAttribute('data-srcset')) img.setAttribute('srcset', img.getAttribute('data-srcset'));
            if (img.previousElementSibling && img.previousElementSibling.getAttribute('data-srcset')) img.setAttribute('srcset', img.previousElementSibling.getAttribute('data-srcset'));
        }
    }, 100);

    setTimeout(() => {
        for (let img of document.querySelectorAll('img')) {
            img.style.width = 'auto';
            if (img.width < 250 && img.width > 10) {
                img.parentNode.removeChild(img);
            } else {
                img.removeAttribute('width');
                img.removeAttribute('height');
                img.style.width = '100%';
            }

        }
    }, 200);
}

function settingChanged(evt) {
    let attr = evt.target.id.split('-').pop();
    let value = evt.target.value;
    switch (attr) {
        case 'width':
        case 'fontSize':
            inner.style[attr] = value + 'px';
            break;
        case 'fontFamily':
            document.querySelector('#readermode-css').innerHTML += `.readermode-inner * { font-family: ${value};}\n`;
            break;
        case 'lineHeight':
            document.querySelector('#readermode-css').innerHTML += `.readermode-inner .p, .readermode-inner p { line-height: ${value};}\n`;
            break;
        case 'autoMode':
            if (evt.target.checked) {
                urls.push(currUrl);
            } else {
                urls = urls.filter(x => x != currUrl);
            }
            value = urls.join(',');
    }

    if (evt.type) {
        let obj = {};
        obj[attr] = value;
        chrome.storage.local.set(obj);
    }
}

function initControlPanel(data) {
    let options = '';
    for (let k in FONTS) options += `<option value='${FONTS[k]}'>${k}</option>`;
    document.querySelector('#readermode-fontFamily').innerHTML = options;

    for (let k in SETTINGS_DEFAULT) {
        let input = document.querySelector(`#readermode-${k}`);
        if (!input) continue;
        let v = data[k];
        if (!v) v = SETTINGS_DEFAULT[k];

        if (input.getAttribute('type') == 'checkbox' && v == '1') {
            input.setAttribute('checked', 1);
        } else {
            input.value = v;
        }
        input.addEventListener('input', evt => settingChanged(evt));
        settingChanged({ target: input });
    }
}

function initContent(data) {
    if (data.html) inner.innerHTML = data.html;
    if (!inner.querySelector('h1')) {
        let h1 = document.createElement('h1');
        h1.innerHTML = data.title;
        inner.prepend(h1);
    }

    if (!data.autoMode) { urls = []; } else {
        urls = data.autoMode.split(',');
    }

    currUrl = data.url;
    if (currUrl) {
        let arr = currUrl.split('/');
        if (arr.length > 4) {
            arr.splice(4);
            currUrl = arr.join('/');
        }
    }
    if (urls.includes(currUrl)) {
        data.autoMode = '1';
    }
    initControlPanel(data);
}


chrome.storage.local.get(Object.keys(SETTINGS_DEFAULT), data => initContent(data));