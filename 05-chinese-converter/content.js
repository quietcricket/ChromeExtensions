function convert(node, c1, c2) {
    let t = c1(node.innerText);
    if (t == node.innerText) {
        t = c2(node.innerText);
    }
    node.innerHTML = t.split("\n").join("<br/>");
};

function findParent(ele, container) {
    if (ele.parentElement == container) return ele;
    return findParent(ele.parentElement, container);
}
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    let c1 = await OpenCC.Converter('t', 'cn');
    let c2 = await OpenCC.Converter('cn', 't');
    let r = getSelection().getRangeAt(0);
    if (r.startContainer == r.endContainer) return convert(r.startContainer.parentElement, c1, c2);

    let startEle = findParent(r.startContainer, r.commonAncestorContainer);
    let endEle = findParent(r.endContainer, r.commonAncestorContainer);
    while (startEle) {
        convert(startEle, c1, c2);
        if (startEle == endEle) break;
        startEle = startEle.nextElementSibling;
    }
});