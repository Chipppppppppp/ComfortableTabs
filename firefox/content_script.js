function dfs(win) {
    if (!win) return;

    try {
        let load = null, target = null, skip = null;
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
                element.target = "_top";
                target.dispatchEvent(new MouseEvent("click", {
                    clientX: e.clientX,
                    clientY: e.clientY,
                    screenX: e.screenX,
                    screenY: e.screenY
                }));
                target = null;
            }, 300);
            target = element;
        });
    } catch (_) {
        return;
    }

    let doc = win.document ? win.document : win;

    doc.querySelectorAll("iframe").forEach(e => dfs(e.contentWindow));
    doc.querySelectorAll("*").forEach(e => dfs(e.shadowRoot));

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(e => {
                dfs(e.contentWindow);
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
