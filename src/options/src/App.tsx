// Reference: https://github.com/aelbore/esbuild-jest/issues/61#issuecomment-990032621
import * as React from "react";
import { useCallback } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import type { FormControlProps } from "react-bootstrap/FormControl";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import "./App.css";
import { STORAGE_KEY_CONFIGS } from "../../constants";
import type { ConfigsType } from "../../types";

const DEFAULT_FORM_STATE: ConfigsType = {
  isWhitelistMode: true,
  whitelist: "",
  blacklist: "",
} as const;

const Mode = ({
  name,
  label,
  isActive,
  onActivate,
  value,
  onValueChange,
}: {
  name: string;
  label: string;
  isActive: boolean;
  value: string;
  onValueChange: (v: string) => void;
  onActivate: () => void;
  // formAction
}) => {
  const handleChange: NonNullable<FormControlProps["onChange"]> = useCallback(
    (event) => {
      onValueChange(event.target.value);
    },
    [onValueChange],
  );
  return (
    <Form.Group className="my-5">
      <Card>
        <Card.Header>
          <Form.Check
            type="radio"
            id={name}
            name={`${name}Mode`}
            value={name}
            checked={isActive}
            label={label}
            className="mb-3"
            onClick={onActivate}
            // formAction={formAction}
          />
        </Card.Header>
        <Card.Body>
          <FloatingLabel
            controlId={`${name}Textarea`}
            label="Domain, one per line"
          >
            <Form.Control
              as="textarea"
              placeholder="e.g. www.wikipedia.org"
              style={TEXTAREA_STYLE}
              disabled={!isActive}
              value={value}
              onChange={handleChange}
            />
          </FloatingLabel>
        </Card.Body>
      </Card>
    </Form.Group>
  );
};

const TEXTAREA_STYLE = { minHeight: "16rem" };

type ToggleModePayloadType = {
  type: "TOGGLE_MODE";
  data: boolean;
};
type ChangeListPayloadType = {
  type: "CHANGE_LIST";
  data:
    | {
        whitelist: string;
      }
    | {
        blacklist: string;
      };
};

type FormPayloadType = ToggleModePayloadType | ChangeListPayloadType;

export const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action: FormPayloadType) => {
      switch (action.type) {
        case "TOGGLE_MODE":
          return {
            ...prevState,
            isWhitelistMode: action.data,
          };
        case "CHANGE_LIST":
          return {
            ...prevState,
            ...action.data,
          };
      }
    },
    DEFAULT_FORM_STATE,
  );

  const { isWhitelistMode, whitelist, blacklist } = state;

  const createToggleModeDispatcher = React.useCallback(
    (data: boolean) => () => dispatch({ type: "TOGGLE_MODE", data }),
    [dispatch],
  );
  const createChangeListDispatcher = React.useCallback(
    (key: "whitelist" | "blacklist") => (value: string) =>
      dispatch({
        type: "CHANGE_LIST",
        data: { [key]: value },
      } as ChangeListPayloadType),
    [dispatch],
  );

  const handleSave = React.useCallback(async () => {
    try {
      await chrome.storage.local.set({ [STORAGE_KEY_CONFIGS]: state });
      //   TODO: show toast
    } catch (e) {
      //   TODO: show toast
    }
  }, [state]);

  return (
    <>
      <h1>Mute Tab By Default</h1>
      <Form>
        <fieldset>
          <legend>Configurations</legend>

          <Mode
            name="whitelist"
            label="Always mute expect these domains (Whitelist mode):"
            isActive={isWhitelistMode}
            onActivate={React.useMemo(
              () => createToggleModeDispatcher(true),
              [createToggleModeDispatcher],
            )}
            value={whitelist}
            onValueChange={React.useMemo(
              () => createChangeListDispatcher("whitelist"),
              [createChangeListDispatcher],
            )}
          />

          <Mode
            name="blacklist"
            label="Only mute these domains (Blacklist mode):"
            isActive={!isWhitelistMode}
            onActivate={React.useMemo(
              () => createToggleModeDispatcher(false),
              [createToggleModeDispatcher],
            )}
            value={blacklist}
            onValueChange={React.useMemo(
              () => createChangeListDispatcher("blacklist"),
              [createChangeListDispatcher],
            )}
          />

          <Button variant="primary" className="mt-3" onClick={handleSave}>
            Save
          </Button>
        </fieldset>
      </Form>
    </>
  );
};
