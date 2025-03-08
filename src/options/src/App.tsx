// Reference: https://github.com/aelbore/esbuild-jest/issues/61#issuecomment-990032621
import * as React from "react";
import { useCallback } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import type { FormControlProps } from "react-bootstrap/FormControl";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import "./App.css";
import type { ConfigsType } from "../../types";
import { ChromeLocalStorage } from "../../storage";

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
type SyncFromStoragePayloadType = {
  type: "SYNC_FROM_STORAGE";
  data: ConfigsType;
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

type FormPayloadType =
  | ToggleModePayloadType
  | ChangeListPayloadType
  | SyncFromStoragePayloadType;

const TOAST_STYLE = {
  position: "fixed",
  bottom: "2rem",
  right: "2rem",
} as const;

export const App = () => {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showFailed, setShowFailed] = React.useState(false);

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
        case "SYNC_FROM_STORAGE":
          return {
            ...prevState,
            ...action.data,
          };
      }
    },
    DEFAULT_FORM_STATE,
  );

  // TODO: implement loading state when loading from storage
  React.useEffect(() => {
    ChromeLocalStorage.getConfigs().then((configs) => {
      if (configs) {
        dispatch({
          type: "SYNC_FROM_STORAGE",
          data: configs,
        });
      }
    });
  }, []);

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
      await ChromeLocalStorage.setConfigs(state);
      // TODO: multiple toast when saved multiple times
      setShowSuccess(true);
    } catch (e) {
      // TODO: show error message to user?
      setShowFailed(true);
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

          <Toast
            onClose={useCallback(() => setShowFailed(false), [])}
            show={showFailed}
            delay={3000}
            bg="danger"
            autohide
            style={TOAST_STYLE}
          >
            <Toast.Header>
              <strong className="me-auto">Failed to save configs!</strong>
            </Toast.Header>
            <Toast.Body>
              Unfortunately, it has failed to save the configs, try again later
              or report the error to
              https://github.com/htbkoo/edge-extension-mute-tab-by-default
            </Toast.Body>
          </Toast>
          <Toast
            onClose={useCallback(() => setShowSuccess(false), [])}
            show={showSuccess}
            delay={3000}
            bg="success"
            autohide
            style={TOAST_STYLE}
          >
            <Toast.Header>
              <strong className="me-auto">Configs saved!</strong>
            </Toast.Header>
            <Toast.Body>
              The new configs will be used for new tabs created from now on.
            </Toast.Body>
          </Toast>
        </fieldset>
      </Form>
    </>
  );
};
