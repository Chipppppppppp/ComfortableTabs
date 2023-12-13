let newTabs = new Set;

chrome.tabs.onCreated.addListener(tab => {
    if (tab.openerTabId !== undefined && tab.status === "complete") {
        chrome.tabs.update(tab.openerTabId, { active: true });
        newTabs.add(tab.id);
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url !== undefined && newTabs.has(tabId)) {
        newTabs.delete(tabId);
        chrome.tabs.remove(tabId);
        chrome.tabs.update(tab.openerTabId, { url: changeInfo.url });
    }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
    chrome.tabs.create({ url: msg, index: sender.tab.index + 1 }, tab => chrome.tabs.update(tab.id, { openerTabId: sender.tab.id }));
})
