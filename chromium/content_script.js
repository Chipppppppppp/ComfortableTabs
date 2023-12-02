function dfs(doc) {
    if (doc === null) return;
    let load = null;
    doc.addEventListener("click", e => {
        if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button !== 0) return;
        let element = e.target;
        for (; ; element = element.parentElement) {
            if (element === null) return;
            if (element.href !== undefined) break;
        }
        e.preventDefault();
        e.stopPropagation();
        if (load !== null) {
            clearTimeout(load);
            load = null;
            chrome.runtime.sendMessage(element.href);
            return;
        }
        load = setTimeout(() => {
            load = null;
            location.href = element.href;
        }, 300);
    }, true);
    for (let iframe of doc.getElementsByTagName("iframe")) dfs(iframe.contentDocument);
}
dfs(document);
