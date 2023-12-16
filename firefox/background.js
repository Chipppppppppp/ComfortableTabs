let newTabs = new Set;

chrome.runtime.onMessage.addListener((msg, sender) => {
    chrome.tabs.create({ url: msg, index: sender.tab.index + 1, openerTabId: sender.tab.id });
});
