let ele = document.createElement('script');
ele.src = chrome.runtime.getURL('injection.js');
document.body.appendChild(ele);

ele = document.createElement('link');
ele.setAttribute('href', chrome.runtime.getURL('injection.css'));
ele.setAttribute('rel', "stylesheet");
document.body.appendChild(ele);