chrome.runtime.onMessage.addListener((msg, sender) => {
    chrome.tabs.duplicate(sender.tab.id, () => {
        chrome.tabs.update(sender.tab.id, { url: msg, active: true });
        chrome.tabs.move(sender.tab.id, { index: sender.tab.index + 1 });
    });
});
