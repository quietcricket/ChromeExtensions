let viewer;
let holder;
let img;

function getViewer() {
    if (!viewer) {
        let ele = document.createElement('link');
        ele.setAttribute('href', chrome.runtime.getURL('injection.css'));
        ele.setAttribute('rel', "stylesheet");
        document.body.appendChild(ele);

        viewer = document.createElement('div');
        viewer.className = 'zoom-img-chrome-extension';
        viewer.innerHTML = `<div class="zoom-img-holder"></div> 
                            <div class="zoom-btns-holder">
                                <div class="zoom-plus-btn"></div>
                                <div class="zoom-minus-btn"></div>
                                <div class="zoom-close-btn"></div>
                            </div>`;
        document.body.appendChild(viewer);

        holder = viewer.querySelector('.zoom-img-holder');
        holder.ox = 0;
        holder.oy = 0;

        viewer.querySelector('.zoom-plus-btn').addEventListener('click', () => {
            img.width *= 1.2;
            img.height *= 1.2;
        });

        viewer.querySelector('.zoom-minus-btn').addEventListener('click', () => {
            img.width *= 0.8;
            img.height *= 0.8;
        });
        viewer.querySelector('.zoom-close-btn').addEventListener('click', () => {
            viewer.style.display = 'none';
            holder.innerHTML = '';
            holder.style.transform = '';
            holder.ox = 0;
            holder.oy = 0;
        });


        viewer.addEventListener('mousemove', evt => {
            if (!img.isDragging) return;
            let tx = holder.ox + evt.clientX - img.ox;
            let ty = holder.oy + evt.clientY - img.oy;
            console.log(holder.ox, holder.oy, tx, ty);
            holder.style.transform = `translate(${tx}px,${ty}px)`;

        });
        viewer.addEventListener('mouseup', evt => {
            if (!img.isDragging) return;
            img.isDragging = false;
            holder.ox += evt.clientX - img.ox;
            holder.oy += evt.clientY - img.oy;
            img.style.cursor = 'grab';
        });
        viewer.addEventListener('wheel', evt => {
            const scale = 0.1;
            if (evt.deltaY > 0) {
                img.width *= (1 + scale);
                img.height *= (1 + scale);
            } else {
                img.width *= (1 - scale);
                img.height *= (1 - scale);
            }
            evt.stopPropagation();
            evt.preventDefault();
        });

        window.addEventListener('keydown', evt => {
            if (evt.key === 'Escape') {
                viewer.style.display = 'none';
                holder.innerHTML = '';
                holder.style.transform = '';
                holder.ox = 0;
                holder.oy = 0;
            }
        });
    }
    viewer.style.display = 'block'
    return viewer;
}

function showImage(src) {
    img = new Image();
    img.onload = function (evt) {
        img.ow = img.width;
        img.oh = img.height;
        let scale = Math.min((innerWidth - 60) / img.width, (innerHeight - 60) / img.height);
        img.width = img.ow * scale;
        img.height = img.oh * scale;
    }
    img.addEventListener('mousedown', evt => {
        img.ox = evt.clientX;
        img.oy = evt.clientY;
        img.isDragging = true;
        img.style.cursor = 'grabbing';
        let holder = viewer.querySelector('.zoom-img-holder');
    });
    img.src = src;
    getViewer().querySelector('.zoom-img-holder').appendChild(img);
}


chrome.runtime.onMessage.addListener((message, sender, response) => {
    article = null;
    showImage(message.srcUrl);
});