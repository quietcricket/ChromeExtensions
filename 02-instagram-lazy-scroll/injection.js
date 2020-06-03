class InstagramLazyScroll {
    constructor() {
        this.SCROLL_MARGIN = 60;
        this.TIME_INTERVAL = 200;

        this.timeout = null;
        this.article = null;
        window.addEventListener('keydown', evt => this.onKeydown(evt));
        this.lastScrollTime = null;
        this.speed = parseInt(localStorage.getItem('speed', '4'));
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
        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') return;
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
        this.timeout = setTimeout(() => this.scroll(), this.speed * this.TIME_INTERVAL);
        if (document.querySelectorAll('article').length < 4) {
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            this.article = null;
            return;
        }
        if (!this.article) {
            this.article = document.querySelector('article').nextElementSibling;
        } else if (this.article.nextElementSibling) {
            this.article = this.article.nextElementSibling;
        }
        window.scrollTo({ 'top': this.article.getBoundingClientRect().top + window.pageYOffset - this.SCROLL_MARGIN });
    }
    stopScroll() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }
    changeSpeed(n) {
        if (n != 0) {
            this.stopScroll();
            this.speed += n;
            localStorage.setItem('speed', this.speed);
            this.timeout = setTimeout(() => this.scroll(), this.speed * this.TIME_INTERVAL);
        }
        this.hud.querySelector('.__speed>span').innerHTML = 16 - this.speed + '';
    }
}
new InstagramLazyScroll();