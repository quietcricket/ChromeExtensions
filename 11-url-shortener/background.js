chrome.browserAction.onClicked.addListener(function (tab) {
  console.log(tab.url);
  fetch("https://api.twos.cc?url=" + encodeURIComponent(tab.url))
    .then(resp => {
      resp.text().then(txt => alert("http://twos.cc/" + txt));
    })
    .catch(err => alert("URL failed. Maybe try again later?"));
});
