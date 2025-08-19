const SERVER_URL = 'http://localhost:6060'; // Change this to your server URL

function generateUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function injectTrackingElements() {
    const emailId = generateUniqueId();
    chrome.storage.local.set({ [emailId]: { sent: new Date().toISOString(), recipient: '' } });

    const trackingPixel = `<img src="${SERVER_URL}/track?emailId=${emailId}" width="1" height="1" style="display:none;">`;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const emailBody = document.querySelector('div[aria-label="Message Body"]');
            if (emailBody && !emailBody.dataset.tracked) {
                emailBody.dataset.tracked = true;
                emailBody.innerHTML += trackingPixel;

                // Rewrite links
                const links = emailBody.querySelectorAll('a');
                links.forEach(link => {
                    const originalUrl = link.href;
                    if (originalUrl && !originalUrl.startsWith(SERVER_URL)) {
                        link.href = `${SERVER_URL}/link?emailId=${emailId}&url=${encodeURIComponent(originalUrl)}`;
                    }
                });

                // Rewrite attachment links (Gmail stores attachments in a specific format)
                const attachments = document.querySelectorAll('a[href*="view=att"]');
                attachments.forEach(attachment => {
                    const originalUrl = attachment.href;
                    const fileName = attachment.textContent.trim() || 'unknown';
                    if (originalUrl && !originalUrl.startsWith(SERVER_URL)) {
                        attachment.href = `${SERVER_URL}/download?emailId=${emailId}&fileUrl=${encodeURIComponent(originalUrl)}&fileName=${encodeURIComponent(fileName)}`;
                    }
                });
            }

            // Capture recipient email
            const toField = document.querySelector('div[name="to"]');
            if (toField && toField.value) {
                chrome.storage.local.get(emailId, (data) => {
                    if (data[emailId]) {
                        data[emailId].recipient = toField.value;
                        chrome.storage.local.set({ [emailId]: data[emailId] });
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener('load', () => {
    if (window.location.href.includes('mail.google.com')) {
        injectTrackingElements();
    }
});