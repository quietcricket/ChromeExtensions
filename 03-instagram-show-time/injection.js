class InstgramShowTime {
    constructor() {
        this.firstload = true;
        this.CSS_CLASS = '__instagram_show_time';
        this.heart = `<svg aria-label="Like"  fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>`;
        this.comment = `<svg aria-label="Comment" fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path clip-rule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fill-rule="evenodd"></path></svg>`;
        var XHR = XMLHttpRequest.prototype;
        var send = XHR.send;
        var open = XHR.open;
        XHR.open = function(method, url) {
            this.url = url;
            return open.apply(this, arguments);
        }
        XHR.send = function() {
            if (this.url.indexOf('/graphql/query/') > -1 || this.url.indexOf('?__a=') > -1) {
                this.addEventListener('load', evt => __instagram_show_time.dataReceived(JSON.parse(this.response, evt)));
            }
            return send.apply(this, arguments);
        };
        this.cache = {};
        setInterval(() => this.attach(), 500);
        this.dataReceived(_sharedData);
    }

    dataReceived(data) {
        let nodes = [];
        this.findNodes(data, nodes);
        if (nodes.length > 0) {
            this.firstload = false;
        }
        for (let n of nodes) {
            if (!n.shortcode) continue;
            if (!n.edge_media_to_comment) continue;
            let t = new Date(n.taken_at_timestamp * 1000);
            let text = `<span>${t.getFullYear()}-${this._addZero(t.getMonth()+1)}-${this._addZero(t.getDate())}</span>`;
            if (n.location) text += `<span class="location">${n.location.name}</span>`;
            text += `<span>${this.heart} ${n.edge_media_preview_like.count} ${this.comment} ${n.edge_media_to_comment.count}</span>`;
            this.cache[n.shortcode] = text;
        }
    }

    attach() {
        for (let ele of document.querySelectorAll('a[href^="/p/"]')) {
            if (ele.querySelector('.' + this.CSS_CLASS)) continue;
            this.shortcode = ele.getAttribute('href').split('/')[2];
            let text = this.cache[ele.getAttribute('href').split('/')[2]];
            if (!text) continue;
            let d = document.createElement('div');
            d.className = this.CSS_CLASS;
            d.innerHTML = text;
            ele.appendChild(d);
        }
    }

    findNodes(obj, arr) {
        for (let k in obj) {
            if (k == 'node') {
                arr.push(obj[k]);
            } else if (typeof obj[k] == 'object' && obj[k] !== null) {
                this.findNodes(obj[k], arr);
            }
        }
    }

    _addZero(n) {
        return n > 9 ? n : '0' + n;
    }
}
window.__instagram_show_time = new InstgramShowTime();