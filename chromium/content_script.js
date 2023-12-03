function dfs(win) {
    if (!win) return;

    try {
        let load = null, target = null;
        win.addEventListener("click", e => {
            if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button !== 0) return;
            let element = e.target;
            for (; ; element = element.parentElement) {
                if (!element) return;
                if (element.href !== undefined) break;
            }
            e.preventDefault();
            e.stopPropagation();
            if (load && target === element) {
                clearTimeout(load);
                load = null;
                target = null;
                chrome.runtime.sendMessage(element.href);
                return;
            }
            load = setTimeout(() => {
                load = null;
                target = null;
                location.href = element.href;
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
