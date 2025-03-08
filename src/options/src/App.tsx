// Reference: https://github.com/aelbore/esbuild-jest/issues/61#issuecomment-990032621
import * as React from "react";
import { useActionState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import type { FormControlProps } from "react-bootstrap/FormControl";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import "./App.css";

interface FormStateType {
  isWhitelistMode: boolean;
  whitelist: string;
  blacklist: string;
}

const DEFAULT_FORM_STATE = {
  isWhitelistMode: true,
  whitelist: "",
  blacklist: "",
} as const satisfies FormStateType;

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
type K = keyof ChangeListPayloadType["data"];

const key: "whitelist" | "blacklist" = "whitelist";
const x = {
  type: "CHANGE_LIST",
  data: {
    [key]: "string",
  },
} satisfies ChangeListPayloadType;

type FormPayloadType = ToggleModePayloadType | ChangeListPayloadType;

export const App = () => {
  // const [state, formAction, isPending] = useActionState<
  //   FormStateType,
  //   FormPayloadType
  // >(
  //   React.useCallback((prevState, payload) => {
  //     console.log("debugdebug=>(App.tsx:32) ", payload);
  //
  //     switch (payload.type) {
  //       case "TOGGLE_MODE":
  //         return {
  //           ...prevState,
  //           isWhitelistMode: payload.data,
  //         };
  //       case "CHANGE_LIST":
  //         return {
  //           ...prevState,
  //           ...payload.data,
  //         };
  //     }
  //   }, []),
  //   DEFAULT_FORM_STATE,
  // );

  const [state, dispatch] = React.useReducer((state, action) => {

    switch (payload.type) {
      case "TOGGLE_MODE":
        return {
          ...prevState,
          isWhitelistMode: payload.data,
        };
      case "CHANGE_LIST":
        return {
          ...prevState,
          ...payload.data,
        };
    }
  }, DEFAULT_FORM_STATE);

  const { isWhitelistMode, whitelist, blacklist } = state;

  const createToggleModeDispatcher = React.useCallback(
    (data: boolean) => () => formAction({ type: "TOGGLE_MODE", data }),
    [formAction],
  );
  // const createChangeListDispatcher = React.useCallback(
  //   (key: K) => (value: string) =>
  //     formAction({
  //       type: "CHANGE_LIST",
  //       // data: { [key]: value },
  //       data: {[key]: value},
  //     } satisfies FormPayloadType),
  //   [formAction],
  // );

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
            onValueChange={React.useCallback(
              (value: string) =>
                formAction({
                  type: "CHANGE_LIST",
                  data: { whitelist: value },
                }),
              [formAction],
            )}
          />
          {/*<Form.Group className="my-5">*/}
          {/*  <Card>*/}
          {/*    <Card.Header>*/}
          {/*      <Form.Check*/}
          {/*        type="radio"*/}
          {/*        id="whitelist"*/}
          {/*        name="whitelistMode"*/}
          {/*        value="whitelist"*/}
          {/*        checked={isWhitelistMode}*/}
          {/*        label="Always mute expect these domains (Whitelist mode):"*/}
          {/*        className="mb-3"*/}
          {/*      />*/}
          {/*    </Card.Header>*/}
          {/*    <Card.Body>*/}
          {/*      <FloatingLabel*/}
          {/*        controlId="whitelistTextarea"*/}
          {/*        label="Domain, one per line"*/}
          {/*      >*/}
          {/*        <Form.Control*/}
          {/*          as="textarea"*/}
          {/*          placeholder="e.g. www.wikipedia.org"*/}
          {/*          style={TEXTAREA_STYLE}*/}
          {/*          disabled={!isWhitelistMode}*/}
          {/*        />*/}
          {/*      </FloatingLabel>*/}
          {/*    </Card.Body>*/}
          {/*  </Card>*/}
          {/*</Form.Group>*/}

          <Mode
            name="blacklist"
            label="Only mute these domains (Blacklist mode):"
            isActive={!isWhitelistMode}
            onActivate={React.useMemo(
              () => createToggleModeDispatcher(false),
              [createToggleModeDispatcher],
            )}
            value={whitelist}
            onValueChange={React.useCallback(
              (value: string) =>
                formAction({
                  type: "CHANGE_LIST",
                  data: { blacklist: value },
                }),
              [formAction],
            )}
          />
          {/*<Form.Group className="my-5">*/}
          {/*  <Card>*/}
          {/*    <Card.Header>*/}
          {/*      <Form.Check*/}
          {/*        type="radio"*/}
          {/*        id="blacklist"*/}
          {/*        name="whitelistMode"*/}
          {/*        value="blacklist"*/}
          {/*        checked={!isWhitelistMode}*/}
          {/*        label="Only mute these domains (Blacklist mode):"*/}
          {/*        className="mb-3"*/}
          {/*      />*/}
          {/*    </Card.Header>*/}
          {/*    <Card.Body>*/}
          {/*      <FloatingLabel*/}
          {/*        controlId="blacklistTextarea"*/}
          {/*        label="Domain (one per line)"*/}
          {/*      >*/}
          {/*        <Form.Control*/}
          {/*          as="textarea"*/}
          {/*          placeholder="e.g. www.wikipedia.org"*/}
          {/*          style={TEXTAREA_STYLE}*/}
          {/*          disabled={isWhitelistMode}*/}
          {/*        />*/}
          {/*      </FloatingLabel>*/}
          {/*    </Card.Body>*/}
          {/*  </Card>*/}
          {/*</Form.Group>*/}

          {/* @ts-expect-error shut up */}
          <Button variant="primary" className="mt-3" formAction={formAction}>
            Save
          </Button>
        </fieldset>
      </Form>
    </>
  );
};
