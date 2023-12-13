let newTabs = new Set, newTabsToDelete = new Set;

chrome.tabs.onCreated.addListener(tab => {
    if (tab.openerTabId !== undefined) {
        chrome.tabs.update(tab.openerTabId, { active: true });
        newTabs.add(tab.id);
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url === undefined) return;
    if (newTabs.has(tabId)) {
        newTabs.delete(tabId);
        if (changeInfo.url === "about:blank") newTabsToDelete.add(tabId);
        return;
    } else if (newTabsToDelete.has(tabId)) {
        chrome.tabs.remove(tabId);
        chrome.tabs.update(tab.openerTabId, { url: changeInfo.url });
    }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
    chrome.tabs.create({ url: msg, index: sender.tab.index + 1 }, tab => chrome.tabs.update(tab.id, { openerTabId: sender.tab.id }));
})
