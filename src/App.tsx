import React from "react";
import { Column } from "./Column";
import { AddNewItem } from "./AddNewItem";
import { AppContainer } from "./styles";
import { useAppState } from "./AppStateContext";
import { CustomDragLayer } from "./CustomDragLayer";

export default function App() {
  const { state, dispatch } = useAppState();
  return (
    <AppContainer>
      <CustomDragLayer />
      {state.lists.map((list, i) => {
        return <Column id={list.id} text={list.text} key={list.id} index={i} />;
      })}
      <AddNewItem
        toggleButtonText="+ create another 1 lsit"
        onAdd={(text) => dispatch({ type: "ADD_LIST", payload: text })}
      />
    </AppContainer>
  );
}
