let newTabs = new Set;

chrome.tabs.onCreated.addListener(tab => {
    if (tab.openerTabId !== undefined && tab.pendingUrl === undefined && tab.active) {
        chrome.tabs.update(tab.openerTabId, { active: true });
        newTabs.add(tab.id);
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (newTabs.has(tabId)) {
        newTabs.delete(tabId);
        if (changeInfo.url.startsWith("http")) {
            chrome.tabs.remove(tabId);
            chrome.tabs.sendMessage(tab.openerTabId, changeInfo.url);
        }
    }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
    chrome.tabs.create({ url: msg, index: sender.tab.index + 1, openerTabId: sender.tab.id }, tab => newTabs.delete(tab.id))
})
