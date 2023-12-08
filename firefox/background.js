let newTabs = new Set;

chrome.tabs.onCreated.addListener(tab => {
    if (tab.openerTabId !== undefined) newTabs.add(tab.id);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete" && changeInfo.url !== undefined && newTabs.has(tabId)) {
        newTabs.delete(tabId);
        if (changeInfo.url.startsWith("http")) {
            chrome.tabs.remove(tabId);
            chrome.tabs.sendMessage(tab.openerTabId, changeInfo.url);
        }
    }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
    chrome.tabs.create({ url: msg, index: sender.tab.index + 1, openerTabId: sender.tab.id }, tab => newTabs.delete(tab.id));
})
