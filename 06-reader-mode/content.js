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
        chrome.storage.local.set({ html: this.makeHtml(), title: this.makeTitle(), url: document.location.href });
        let iframe = document.createElement('iframe');
        iframe.id = 'readermode';
        iframe.src = chrome.runtime.getURL('reader.html');
        iframe.style.width = "100%";
        iframe.style.height = "100vh";
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.left = "0";
        document.body.appendChild(iframe);
        document.body.style.overflow = 'hidden';
        let zindex = 1;
        document.querySelectorAll('div,footer,nav,header').forEach(ele => {
            let z = parseInt(getComputedStyle(ele).zIndex);
            if (!isNaN(z)) zindex = Math.max(zindex, z);
        });
        iframe.style.zIndex = zindex + 10;
    }

    makeTitle() {
        let title = document.title;
        let meta = document.querySelector('[property="og:title"]');
        if (meta) {
            title = meta.getAttribute('content');
        } else {
            let h1 = document.querySelector('h1')
            if (h1) title = h1.textContent;
        }
        return title;
    }

    makeHtml() {
        function findTextElements(node, arr) {
            if (['ASIDE', 'SCRIPT', 'STYLE', 'NOSCRIPT', 'FORM'].includes(node.tagName)) return;
            if (node.childElementCount == 0) return arr.push(node);
            if (node.tagName == 'FIGURE') return arr.push(node);
            if (node.tagName == 'SPAN') return arr.push(node);
            const INLINE_TAGS = ['A', 'ABBR', 'ACRONYM', 'B', 'BDO', 'BIG', 'BR', 'BUTTON', 'CITE', 'CODE', 'DFN', 'EM', 'I', 'IMG', 'INPUT', 'KBD', 'LABEL', 'MAP', 'OBJECT', 'OUTPUT', 'Q', 'SAMP', 'SCRIPT', 'SELECT', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP', 'TEXTAREA', 'TIME', 'TT', 'VAR'];
            for (let c of node.children) {
                if (!INLINE_TAGS.includes(c.tagName) && !c.querySelector('p')) {
                    for (let _c of node.children) findTextElements(_c, arr);
                    return;
                }
            }
            arr.push(node);
        }

        let textHolders = [];
        if (document.querySelector('article header')) {
            for (let ele of document.querySelector('article header').children) textHolders.push(ele);
        }

        findTextElements(this.findArticle(), textHolders);

        function shouldIgnore(ele) {
            if (ele.tagName == 'LI') return true;
            if (ele.querySelectorAll('a').length == 1 && ele.textContent.trim() == ele.querySelector('a').textContent.trim()) return true;
            if (ele.querySelector('svg,button')) return true;
            if (ele.textContent.trim().toLowerCase() == 'advertisement') return true;
        }

        let html = '';
        for (let ele of textHolders) {
            if (shouldIgnore(ele)) continue;
            let _ele = ele.cloneNode(true);
            this._stripStyleClass(_ele);
            if (['P', 'DIV', 'SPAN'].includes(_ele.tagName)) _ele.className = 'p';
            html += _ele.outerHTML;
        }
        return html;
    }



    findArticle() {
        function _findContainer(node, text = null) {
            if (text == null) {
                text = node.textContent.trim();
            }
            let parentText = node.parentNode.textContent.trim();
            if (text == parentText) {
                return _findContainer(node.parentNode, text)
            } else {
                return node.parentNode;
            }
        }

        let maxChildren = 0;
        let maxHolder = null;
        for (let p of document.querySelectorAll('p')) {
            let c = _findContainer(p);
            if (c.tagName == 'BODY') continue;
            if (c == maxHolder) continue;
            let n = c.querySelectorAll('p').length;
            if (n > maxChildren) {
                maxHolder = c;
                maxChildren = n;
            }
        }
        return maxHolder;
    }

    _stripStyleClass(ele) {
        if (ele.tagName == 'IFRAME') return;
        ele.removeAttribute('class');
        ele.removeAttribute('style');
        for (let c of ele.children) {
            this._stripStyleClass(c);
        }
    }
}

let __readerMode = new ReaderMode();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    __readerMode.toggle();
});