// Reference: https://github.com/aelbore/esbuild-jest/issues/61#issuecomment-990032621
import * as React from "react";
import { useState, useActionState, useCallback } from "react";
import "./App.css";

const useSyncStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
};

interface FormStateType {
  isWhitelistMode: boolean;
}

const DEFAULT_FORM_STATE = {
  isWhitelistMode: true,
} as const satisfies FormStateType;

export const App = () => {
  const [{isWhitelistMode}, formAction, isPending] = useActionState<FormStateType, P>(
    useCallback((prevState, payload) => {
      return {
        isWhitelistMode: true,
      };
    }, []),
    DEFAULT_FORM_STATE,
  );
  return (
    <>
      <h1>Mute Tab By Default</h1>

      <form action={formAction}>
        <fieldset>
          <legend>Please select your preferred contact method:</legend>
          <div>
            <input
              type="radio"
              id="whitelist"
              name="whitelistMode"
              value="whitelist"
              checked={isWhitelistMode}
            />
            <label htmlFor="whitelist">Always mute expect these domains (whitelist):</label>

            <input
              type="radio"
              id="blacklist"
              name="whitelistMode"
              value="blacklist"
            />
            <label htmlFor="blacklist">Only mute these domains (blacklist):</label>

          </div>
          <div>
            <button type="submit">Save</button>
          </div>
        </fieldset>
      </form>
    </>
  );
};
