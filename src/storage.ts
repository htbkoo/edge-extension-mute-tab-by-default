import { STORAGE_KEY_CONFIGS } from "./constants";
import type { ConfigsType } from "./types";

export const ChromeLocalStorage = {
  getConfigs: async (): Promise<ConfigsType | null> => {
    console.debug("=>(storage.ts:14) getting configs");
    return (
      (await chrome.storage.local.get([STORAGE_KEY_CONFIGS]))[
        STORAGE_KEY_CONFIGS
      ] ?? null
    );
  },
  setConfigs: async (configs: ConfigsType) => {
    console.debug("=>(storage.ts:14) saving configs", configs);
    await chrome.storage.local.set({ [STORAGE_KEY_CONFIGS]: configs });
  },
  listenOnChanged: chrome.storage.local.onChanged.addListener.bind(
    chrome.storage.local.onChanged,
  ),
};
