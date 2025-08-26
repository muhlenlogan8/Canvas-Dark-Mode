const toggle = document.getElementById("toggle");
const msg = document.getElementById("msg");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	const tab = tabs[0];
	if (!tab?.id) {
		msg.textContent = "No active tab";
		return;
	}

	// ask content script for state
	chrome.tabs.sendMessage(tab.id, { type: "GET_STATE" }, (resp) => {
		if (chrome.runtime.lastError) {
			msg.textContent = "Refresh this Canvas page, then try again.";
			return;
		}

		toggle.checked = !!resp?.on;
		msg.textContent = "";

		toggle.addEventListener("change", () => {
			chrome.tabs.sendMessage(tab.id, { type: "TOGGLE" }, (r) => {
				if (!chrome.runtime.lastError) {
					toggle.checked = !!r?.on;
				}
			});
		});
	});
});
