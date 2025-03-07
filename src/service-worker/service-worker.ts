console.debug("=>(service-worker.js) script loaded");

/**
 * This function mutes the tab with the given tabId.
 */
const muteTab = async (tabId: chrome.tabs.Tab["id"]) => {
  if (typeof tabId === "undefined") {
    console.warn(
      "=>(service-worker.js) unable to mute tab, tabId is undefined",
    );
    return;
  }
  await chrome.tabs.update(tabId, { muted: true });
};

/**
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onCreated
 */
chrome.tabs.onCreated.addListener(async (tab) => {
  console.debug("=>(service-worker.js) onCreated, tab.id: ", tab.id);

  try {
    await muteTab(tab.id);
    console.debug("=>(service-worker.js) muted tab");
  } catch (error) {
    console.error("=>(service-worker.js) failed", error);
  }
});
