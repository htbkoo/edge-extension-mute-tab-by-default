// Reference: https://github.com/aelbore/esbuild-jest/issues/61#issuecomment-990032621
import * as React from "react";
import { useActionState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

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

const TEXTAREA_STYLE = { minHeight: "16rem" };

export const App = () => {
  const [{ isWhitelistMode }, formAction, isPending] = useActionState<
    FormStateType,
    {}
  >(
    useCallback((prevState, payload) => {
      console.log("debugdebug=>(App.tsx:32) ", payload);
      return {
        isWhitelistMode: !prevState.isWhitelistMode,
      };
    }, []),
    DEFAULT_FORM_STATE,
  );

  return (
    <>
      <h1>Mute Tab By Default</h1>
      <Form action={formAction}>
        <fieldset>
          <legend>Configurations</legend>

          <Form.Group className="my-5">
            <Card>
              <Card.Header>
                <Form.Check
                  type="radio"
                  id="whitelist"
                  name="whitelistMode"
                  value="whitelist"
                  checked={isWhitelistMode}
                  label="Always mute expect these domains (Whitelist mode):"
                  className="mb-3"
                />
              </Card.Header>
              <Card.Body>
                <FloatingLabel
                  controlId="whitelistTextarea"
                  label="Domain, one per line"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="e.g. www.wikipedia.org"
                    style={TEXTAREA_STYLE}
                    disabled={!isWhitelistMode}
                  />
                </FloatingLabel>
              </Card.Body>
            </Card>
          </Form.Group>

          <Form.Group className="my-5">
            <Card>
              <Card.Header>
                <Form.Check
                  type="radio"
                  id="blacklist"
                  name="whitelistMode"
                  value="blacklist"
                  checked={!isWhitelistMode}
                  label="Only mute these domains (Blacklist mode):"
                  className="mb-3"
                />
              </Card.Header>
              <Card.Body>
                <FloatingLabel
                  controlId="blacklistTextarea"
                  label="Domain (one per line)"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="e.g. www.wikipedia.org"
                    style={TEXTAREA_STYLE}
                    disabled={isWhitelistMode}
                  />
                </FloatingLabel>
              </Card.Body>
            </Card>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>
        </fieldset>
      </Form>
    </>
  );
};
