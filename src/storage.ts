import { STORAGE_KEY_CONFIGS } from "./constants";
import type { ConfigsType } from "./types";

export const ChromeLocalStorage = {
  getConfigs: async (): Promise<ConfigsType | null> => {
    return (
      (await chrome.storage.local.get([STORAGE_KEY_CONFIGS]))[
        STORAGE_KEY_CONFIGS
      ] ?? null
    );
  },
  setConfigs: async (configs: ConfigsType) => {
    await chrome.storage.local.set({ [STORAGE_KEY_CONFIGS]: configs });
  },
};
