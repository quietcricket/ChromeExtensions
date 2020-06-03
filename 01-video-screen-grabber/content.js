let canvas = document.createElement('canvas');

function screengrab(video) {
    if (video.currentTime == 0 && video.getAttribute('poster')) {
        window.open(video.getAttribute('poster'));
        return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    try {
        canvas.toBlob(b => _saveBlob(b, `video-screengrab-${(new Date()).getTime()}.jpg`), 'jpeg', 0.9);
    } catch (error) {
        console.log(error);
        addCrossorigin(video);
    }

}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action != 'doit') return;
    document.querySelectorAll('video').forEach(v => screengrab(v));
});

function addCrossorigin(video) {
    video.setAttribute('crossOrigin', 'Anonymous');
    let nv = video.cloneNode(true);
    nv.targetTime = video.currentTime;
    video.parentNode.insertBefore(nv, video);
    video.parentNode.removeChild(video);
    nv.addEventListener('canplay', canplayListener);
}

function canplayListener(evt) {
    let video = evt.target;
    if (video.currentTime != video.targetTime) {
        video.currentTime = video.targetTime;
    } else {
        screengrab(video);
        video.removeEventListener('canplay', canplayListener);
    }

}

function _saveBlob(blob, fileName) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    let url = URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
};