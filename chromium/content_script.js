function dfs(win) {
    let load = null;
    win.addEventListener("click", e => {
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
    for (let iframe of win.document.getElementsByTagName("iframe")) dfs(iframe.contentWindow);
}
dfs(window);
