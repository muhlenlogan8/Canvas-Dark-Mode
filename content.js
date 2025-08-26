(async () => {
	const hostKey = `darkMode:${location.hostname}`;

	const get = (k) =>
		new Promise((r) => chrome.storage.sync.get(k, (v) => r(v[k])));
	const set = (k, v) =>
		new Promise((r) => chrome.storage.sync.set({ [k]: v }, r));

	// log when injected
	console.log("Canvas Dark Mode content.js injected on", location.href);

	// apply saved state
	const saved = await get(hostKey);
	if (saved === true) {
		document.documentElement.classList.add("canvas-dark");
		console.log("Dark mode restored");
	}

	// respond to popup
	chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
		if (msg?.type === "GET_STATE") {
			sendResponse({
				on: document.documentElement.classList.contains("canvas-dark"),
			});
			return true;
		}
		if (msg?.type === "TOGGLE") {
			const on = document.documentElement.classList.toggle("canvas-dark");
			set(hostKey, on).then(() => {
				console.log("Dark mode toggled:", on);
				sendResponse({ on });
			});
			return true; // keep channel open
		}
	});
})();
