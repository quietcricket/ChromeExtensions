chrome.runtime.sendMessage({ msg: "gen-url" }, function (data) {
  let holder = document.querySelector(".entry-list");
  holder.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    if (i == 1) {
      let header = document.createElement("h3");
      header.innerHTML = "Recent Links";
      holder.appendChild(header);
    }
    let entry = data[i];
    let ele = document.createElement("div");
    ele.className = "entry";
    ele.innerHTML = `<span class="short">http://twos.cc/${entry.short}</span><span class="url"><a href="${entry.url}">${entry.title}</a></span>`;
    holder.appendChild(ele);
  }
  let s = document.querySelector(".short");
  navigator.clipboard.writeText(s.innerHTML);
});
