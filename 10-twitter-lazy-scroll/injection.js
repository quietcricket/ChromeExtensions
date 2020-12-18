class TwitterLazyScroll {
    constructor() {
        this.TIME_INTERVAL = 1000;
        this.timeout = null;
        this.article = null;
        window.addEventListener('keydown', evt => this.onKeydown(evt));
        this.speed = parseInt(localStorage.getItem('speed'));
        if (isNaN(this.speed)) this.speed = 8;
        let ele = document.createElement('div');

        ele.className = '__instagram_lazy_scroll';
        ele.innerHTML = `
        <div class="__status"></div>
        <div class="__speed">
            Speed: <span></span>
            <a class="btn-slower">Slower</a> <a class="btn-faster">Faster</a>
        </div>`;
        document.body.appendChild(ele);
        ele.querySelector('.btn-slower').addEventListener('click', evt => this.changeSpeed(1));
        ele.querySelector('.btn-faster').addEventListener('click', evt => this.changeSpeed(-1));
        this.hud = ele;
        this.changeSpeed(0);
    }
    onKeydown(evt) {
        if (evt.key != ' ') return;
        if (evt.srcElement != document.body) return;
        evt.preventDefault();
        evt.stopPropagation();
        if (this.timeout) {
            this.hud.style.animationName = 'slideOut';
            this.stopScroll();
        } else {
            this.hud.style.animationName = 'slideIn';
            this.scroll();
        }
    }
    scroll() {
        let articles = document.querySelectorAll('article');
        for (let i = 0; i < articles.length - 1; i++) {
            if (articles[i] == this.article) {
                this.article = articles[i + 1];
                break;
            }
        }
        if (!this.article && articles.length > 1) this.article = articles[1];
        this.timeout = setTimeout(() => this.scroll(), this.getInterval());
        if (this.article) this.article.scrollIntoView({ block: "center" });

    }
    stopScroll() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }
    changeSpeed(n) {
        if (n != 0) {
            this.stopScroll();
            this.speed = Math.max(1, this.speed + n);

            localStorage.setItem('speed', this.speed);
            this.timeout = setTimeout(() => this.scroll(), this.getInterval());
        }
        this.hud.querySelector('.__speed>span').innerHTML = 16 - this.speed + '';
    }
    getInterval() {
        return this.article ? this.speed * this.TIME_INTERVAL * Math.sqrt(this.article.offsetHeight / innerHeight) : 100
    }
}
new TwitterLazyScroll();