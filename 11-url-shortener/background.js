let history = null;

chrome.storage.local.get(["history"], result => (history = result.history ? result.history : []));

function genUrl(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tab = tabs[0];
    for (let i = 0; i < history.length; i++) {
      let h = history[i];
      if (h.url == tab.url) {
        history.splice(i, 1);
        history.unshift(h);
        callback(history);
        return;
      }
    }

    fetch("https://api.twos.cc?url=" + encodeURIComponent(tab.url))
      .then(resp =>
        resp.text().then(txt => {
          history.unshift({ url: tab.url, title: tab.title, short: txt });
          if (history.length > 6) {
            history.splice(6, history.length - 6);
          }
          chrome.storage.local.set({ history: history });
          callback(history);
        })
      )
      .catch(err => {
        console.log(err);
        alert("Failed to generate a short URL. Maybe try again later?");
      });
  });
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg == "gen-url") {
    genUrl(sendResponse);
    return true;
  }
});
