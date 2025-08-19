chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'checkTracking') {
        fetch(`http://localhost:6060/status?emailId=${message.emailId}`)
            .then(response => response.json())
            .then(data => sendResponse(data))
            .catch(error => sendResponse({ error: 'Failed to check status' }));
        return true; // Keep the message channel open for async response
    }
});