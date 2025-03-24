let trackingData = {};
let currentTabId = null;
let currentUrl = null;
let startTime = null;

chrome.tabs.onActivated.addListener(activeInfo => {
    if (currentTabId !== null) {
        // Calculate time spent on the previous tab
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        if (currentUrl) {
            if (!trackingData[currentUrl]) {
                trackingData[currentUrl] = 0;
            }
            trackingData[currentUrl] += timeSpent;
            sendDataToBackend(currentUrl, timeSpent);
        }
    }

    // Update current tab
    currentTabId = activeInfo.tabId;
    startTime = Date.now();

    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
            currentUrl = tab.url;
        }
    });
});

// Send data to backend
function sendDataToBackend(url, timeSpent) {
    fetch('http://localhost:8000/add-tracking-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: url,
            time_spent: timeSpent
        })
    }).catch(err => console.error('Failed to send data:', err));
}
