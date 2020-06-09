class PrettyQuote {
    constructor() {
        this.ele = document.querySelector('.quote');
        this.ele.innerHTML = document.querySelector('#text').innerHTML = this.parseText();

        document.querySelector('#text').addEventListener('input', evt => this.ele.innerHTML = this.parseText(evt.target.value));
        document.querySelector('#fontSize').addEventListener('input', evt => this.update(evt.target));
        document.querySelector('#fontFamily').addEventListener('input', evt => this.update(evt.target));
        document.querySelector('.btn-download').addEventListener('click', evt => this.download());
        document.querySelector('.btn-bg').addEventListener('click', evt => this.pickBg());
        for (let btn of document.querySelectorAll('.align-holder i')) {
            btn.addEventListener('click', evt => this.changeAlign(evt.target));
        }
        this.parseFonts();
        this.pickBg();
        let defaultValues = { fontSize: 30, fontFamily: document.querySelector('#fontFamily option').value, textAlign: 'center' };
        for (let k of ['fontSize', 'fontFamily', 'textAlign']) {
            let v = localStorage.getItem(k);
            if (v) {
                if (k == 'textAlign') {
                    this.changeAlign(document.querySelector(`[data=${v}]`));
                } else {
                    document.getElementById(k).value = v;
                }
            } else {
                v=defaultValues[k];
            }

            this.update({ id: k, value: v, skip: true });
        }
    }

    update(data) {
        this.ele.style[data.id] = data.value + (data.id == 'fontSize' ? 'px' : '');
        if (!data.skip) localStorage.setItem(data.id, data.value);
    }

    pickBg() {
        let g = gradients[this._randomInt(0, gradients.length)];
        let pattern = new RegExp('(\\d+, )(\\d+, )\\d+', 'g');
        for (let k in g) this.ele.style[k] = g[k];
        if (!g.backgroundImage) return;
        let arr = g.backgroundImage.match(pattern).join(",").split(",");
        let c = arr.reduce((p, c) => parseInt(p) + parseInt(c));
        if (c / arr.length > 200) {
            this.ele.classList.add('light');
            this.ele.classList.remove('dark');
        } else {
            this.ele.classList.remove('light');
            this.ele.classList.add('dark');
        }
    }

    download() {
        let fs = parseInt(document.querySelector('#fontSize').value);
        let w = this.ele.offsetWidth;
        this.ele.style.fontSize = fs * 2 + 'px';
        this.ele.classList.add('big');
        html2canvas(this.ele).then(canvas => canvas.toBlob(b => this._saveBlob(b, 'pretty-quote.jpg'), 'jpeg', 0.9));
        this.ele.style.fontSize = fs + 'px';
        this.ele.classList.remove('big');
    }

    parseText(text = null) {
        text = text ? text : decodeURIComponent(document.location.search.substr(3));
        return text.replace(/\n/g, '<br/>');
    }

    parseFonts() {
        let url = 'https://fonts.google.com/specimen/Rochester?sidebar.open&selection.family=Architects+Daughter|Arima+Madurai|Chau+Philomene+One|Concert+One|Gochi+Hand|Monoton|Rochester&query=ch#standard-styles';
        let params = new URLSearchParams(url.substr(url.indexOf('?')));
        let href = 'https://fonts.googleapis.com/css2?display=swap';
        for (let f of params.get('selection.family').split('|')) {
            f = f.split(':')[0];
            href += '&family=' + f.replace(' ', '+');
            let opt = document.createElement('option');
            opt.value = f;
            opt.innerHTML = f;
            document.querySelector('#fontFamily').appendChild(opt);
        };
        let ele = document.createElement('link');
        ele.setAttribute('rel', 'stylesheet');
        ele.setAttribute('href', href);
        document.head.appendChild(ele);
    }

    changeAlign(btn) {
        this.update({ id: 'textAlign', value: btn.getAttribute('data') });
        for (let b of document.querySelectorAll('.align-holder i')) {
            b.classList.remove('active');
        }
        btn.classList.add('active');
    }

    _randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    _saveBlob(blob, fileName) {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        let url = URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

new PrettyQuote();