import { render } from "react-dom";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import App from "./App";

import { AppStateProvider } from "./AppStateContext";

const rootElement = document.getElementById("root");
render(
  <DndProvider backend={Backend}>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </DndProvider>,
  rootElement
);
