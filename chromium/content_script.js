function dfs(win) {
    if (!win) return;

    try {
        let load = null, target = null, skip = null;;
        win.addEventListener("click", e => {
            if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button !== 0) return;
            let element = e.target;
            if (element === skip) {
                skip = null;
                return;
            }
            for (; ; element = element.parentElement) {
                if (!element) return;
                if (element.href !== undefined) break;
            }
            element.target = "_top";
            e.preventDefault();
            e.stopPropagation();
            if (element === target) {
                clearTimeout(load);
                target = null;
                chrome.runtime.sendMessage(element.href);
                return;
            }
            load = setTimeout(() => {
                skip = target;
                target.dispatchEvent(new MouseEvent("click", e));
                target = null;
            }, 300);
            target = element;
        }, true);
    } catch (_) {
        return;
    }

    let doc = win.document;
    if (!doc) doc = win;

    doc.querySelectorAll("iframe").forEach(e => dfs(e.contentWindow));
    doc.querySelectorAll("*").forEach(e => dfs(e.shadowRoot));

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(e => {
                dfs(e.contentDocument);
                dfs(e.shadowRoot);
                if (!e.querySelectorAll) return;
                e.querySelectorAll("iframe").forEach(e => dfs(e.contentWindow));
                e.querySelectorAll("*").forEach(e => dfs(e.shadowRoot));
            });
        });
    });
    observer.observe(doc, {
        childList: true,
        subtree: true
    });
}

dfs(window);

let div = document.createElement("div");
div.style.display = "none";
div.style.position = "fixed";
div.style.height = "100vh";
div.style.width = "100vw";
div.style.top = "0";
div.style.left = "0";
div.style.zIndex = 2147483646;
div.addEventListener("click", () => {
    clearTimeout(load);
    div.style.display = "none";
    chrome.runtime.sendMessage(url);
});
document.body.appendChild(div);
let load = null, url = null;

chrome.runtime.onMessage.addListener(msg => {
    url = msg;
    load = setTimeout(() => {
        div.style.display = "none";
        location.href = url;
    }, 300);
    div.style.display = "block";
})
