// Reference: https://github.com/aelbore/esbuild-jest/issues/61#issuecomment-990032621
import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Reference: https://react-bootstrap.netlify.app/docs/getting-started/introduction#css
import 'bootstrap/dist/css/bootstrap.min.css';

import "./index.css";
import { App } from "./App";

const rootElement = document.getElementById("root");
if (rootElement !== null) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  throw new Error("#root element not found");
}
