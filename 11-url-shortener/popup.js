chrome.runtime.sendMessage({ msg: "gen-url" }, function (data) {
  let holder = document.querySelector(".entry-list");
  holder.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    if (i == 1) {
      let header = document.createElement("h2");
      header.innerHTML = "Recent Links";
      header.style.textAlign="center";
      holder.appendChild(header);
    }
    let entry = data[i];
    let ele = document.createElement("div");
    ele.className = "entry";
    ele.innerHTML = `<button class="copy">📝</button><span class="short">http://twos.cc/${entry.short}</span><span class="url"><a href="${entry.url}">${entry.title}</a></span>`;
    holder.appendChild(ele);
  }
  let s = document.querySelector(".short");
  document.querySelector("h2").innerHTML = `<button class="copy">📝</button><span class="short">${s.innerHTML}</span><br/><small style="margin-top:5px;font-size:12px">Copied! You can preass Ctrl+V to paste.</small>`;
  navigator.clipboard.writeText(s.innerHTML);
  document.querySelectorAll(".copy").forEach(ele => {
    ele.addEventListener("click", ev => {
      let ele = ev.currentTarget;
      let s = ele.parentNode.querySelector(".short");
      navigator.clipboard.writeText(s.innerHTML);
      ev.currentTarget.innerHTML = "Copied!";
      setTimeout(() => (ele.innerHTML = "📝"), 3000);
    });
  });
});