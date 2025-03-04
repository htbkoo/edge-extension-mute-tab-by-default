/**
 * Reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onCreated
 */
chrome.tabs.onCreated.addListener(async (tab) => {
  try {
    // Reference: https://www.reddit.com/r/learnjavascript/comments/rwo19m/comment/hrcwqhc/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    await chrome.tabs.update(tab.id, { muted: true });
  } catch (error) {
    console.error(error);
  }
})


