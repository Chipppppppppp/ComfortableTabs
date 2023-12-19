let load = null, target = null, skip = null;
window.addEventListener("beforeunload", () => {
    if (target) {
        clearTimeout(load);
        load = null;
        target = null;
        skip = null;
    }
});
window.addEventListener("click", e => {
    if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button !== 0) return;
    let element = e.target;
    if (skip && element === skip) {
        skip = null;
        return;
    }
    for (; ; element = element.parentElement) {
        if (!element) return;
        if (element.href) break;
    }
    e.preventDefault();
    e.stopPropagation();
    if (load) {
        if (element === target) {
            clearTimeout(load);
            load = null;
            target = null;
            chrome.runtime.sendMessage(element.href);
        }
    } else {
        load = setTimeout(() => {
            load = null;
            target = null;
            element.target = "_top";
            skip = e.target;
            e.target.dispatchEvent(new MouseEvent(e.type, e));
        }, 300);
        target = element;
    }
}, true);
