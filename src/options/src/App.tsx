// Reference: https://github.com/aelbore/esbuild-jest/issues/61#issuecomment-990032621
import * as React from "react";
import { useActionState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "./App.css";

interface FormStateType {
  isWhitelistMode: boolean;
}

const DEFAULT_FORM_STATE = {
  isWhitelistMode: true,
} as const satisfies FormStateType;

const Mode = () => {
  return null;
};

export const App = () => {
  const [{ isWhitelistMode }, formAction, isPending] = useActionState<
    FormStateType,
    {}
  >(
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
      <Form action={formAction}>
        <fieldset>
          <legend>Mode:</legend>

          <Form.Group className="my-6">
            <Form.Check
              type="radio"
              id="whitelist"
              name="whitelistMode"
              value="whitelist"
              checked={isWhitelistMode}
              label="Whitelist mode"
              className="mb-3"
            />

            <Form.Label htmlFor="whitelistTextInput">
              Always mute expect these domains:
            </Form.Label>
            <Form.Control
              id="whitelistTextInput"
              placeholder="Domain (e.g. www.wikipedia.org)"
            />
          </Form.Group>

          <Form.Group className="my-6">
            <Form.Check
              type="radio"
              id="blacklist"
              name="whitelistMode"
              value="blacklist"
              checked={!isWhitelistMode}
              label="Always mute expect these domains (whitelist):"
              className="mb-3"
            />
            <Form.Label htmlFor="blacklistTextInput">
              Always mute expect these domains:
            </Form.Label>
            <Form.Control
              id="blacklistTextInput"
              placeholder="Domain (e.g. www.wikipedia.org)"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </fieldset>
      </Form>
    </>
  );
};
