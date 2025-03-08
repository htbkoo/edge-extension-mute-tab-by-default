import { ChromeLocalStorage } from "../storage";
import type { ConfigsType } from "../types";
import { STORAGE_KEY_CONFIGS } from "../constants";

console.debug("=>(service-worker.js) script loaded");

// TODO: improve this
let configsCache: null | ConfigsType = null;

ChromeLocalStorage.listenOnChanged((storage) => {
  console.debug("=>(service-worker.js) there are changes in storage");

  if (storage[STORAGE_KEY_CONFIGS]) {
    console.debug("=>(service-worker.js) configs changed, loading again");
    configsCache = storage[STORAGE_KEY_CONFIGS].newValue;
  }
});

const initConfigs = async () => {
  if (configsCache) {
    // lazy load to avoid unnecessary reads from storage for every tab creation
    console.debug(
      "=>(service-worker.js) configs already loaded, not loading again",
    );
    return;
  }

  console.debug("=>(service-worker.js) loading configs");
  // TODO: implement exponential backoff
  const configs = await ChromeLocalStorage.getConfigs();
  if (configs) {
    console.debug("=>(service-worker.js) configs loaded");
    configsCache = configs;
  }
};

const LINE_SEPARATOR = /\r?\n|\r|\n/g;

/**
 * This function splits the list by {@link LINE_SEPARATOR}
 *
 * Reference: https://stackoverflow.com/a/21712066
 */
const splitList = (list: string): Array<string> =>
  list.split(LINE_SEPARATOR).filter(Boolean);

/**
 * This function returns if the tab should be muted
 */
const shouldMuteTab = async (tab: chrome.tabs.Tab): Promise<boolean> => {
  if (!configsCache) {
    // unable to determine if the tab should be muted, so don't mute to be safe
    console.warn("=>(service-worker.js) unable to load config, not muting tab");
    return false;
  }

  const { isWhitelistMode, whitelist, blacklist } = configsCache;

  const tabUrl = tab.pendingUrl;
  if (!tabUrl) {
    // unable to determine the url of the tab, so falling back to determine if the tab should be muted based on the mode
    console.warn(
      `=>(service-worker.js) unable to determine tab url, using the mode preferred to determine if the tab should be muted: isWhitelistMode = ${isWhitelistMode}`,
    );
    return isWhitelistMode;
  }

  const url = new URL(tabUrl);
  if (isWhitelistMode) {
    const whitelistHostnames = new Set(splitList(whitelist));
    return !whitelistHostnames.has(url.hostname);
  } else {
    const blacklistHostnames = new Set(splitList(blacklist));
    return blacklistHostnames.has(url.hostname);
  }
};

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
    await initConfigs();
    if (await shouldMuteTab(tab)) {
      await muteTab(tab.id);
      console.debug("=>(service-worker.js:2) muted tab");
    } else {
      console.debug("=>(service-worker.js:2) should not mute tab");
    }
  } catch (error) {
    console.error("=>(service-worker.js) failed", error);
  }
});
