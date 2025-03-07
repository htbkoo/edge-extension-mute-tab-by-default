console.debug("=>(service-worker.js:2) script loaded");

/**
 *
 * @param tabId {number | undefined}
 * @returns {Promise<void>}
 */
const muteTab = async (tabId) => {
  // Reference: https://www.reddit.com/r/learnjavascript/comments/rwo19m/comment/hrcwqhc/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
  await chrome.tabs.update(tabId, { muted: true });
};

/**
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onCreated
 */
chrome.tabs.onCreated.addListener(async (tab) => {
  console.debug("=>(service-worker.js:2) onCreated, tab.id: ", tab.id);

  try {
    await muteTab(tab.id);
    console.debug("=>(service-worker.js:2) muted tab");
  } catch (error) {
    console.error("=>(service-worker.js:2) failed", error);
  }
});
