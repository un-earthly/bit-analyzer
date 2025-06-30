document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('trackedEmails');
    chrome.storage.local.get(null, (items) => {
        for (const [emailId, data] of Object.entries(items)) {
            chrome.runtime.sendMessage({ type: 'checkTracking', emailId }, (response) => {
                const li = document.createElement('li');
                li.innerHTML = `
            <strong>Email ${emailId} (To: ${data.recipient || 'Unknown'})</strong>
            <div class="event">Sent: ${new Date(data.sent).toLocaleString()}</div>
            <div class="event">Opens: ${response.opens?.length || 0} (${response.opens?.map(o => new Date(o.timestamp).toLocaleString()).join(', ') || 'None'})</div>
            <div class="event">Link Clicks: ${response.linkClicks?.length || 0} (${response.linkClicks?.map(c => `${c.link} at ${new Date(c.timestamp).toLocaleString()}`).join(', ') || 'None'})</div>
            <div class="event">Downloads: ${response.downloads?.length || 0} (${response.downloads?.map(d => `${d.fileName} at ${new Date(d.timestamp).toLocaleString()}`).join(', ') || 'None'})</div>
          `;
                list.appendChild(li);
            });
        }
    });
});