import React, { createContext, useReducer, useContext, useEffect } from "react";
import { nanoid } from "nanoid";
import {
  findItemIndexById,
  overrideItemAtIndex,
  moveItem,
  removeItemAtIndex,
  insertItemAtIndex
} from "./utils/arrayUtils";
import { DragItem } from "./DragItem";
import { save } from "./api";
import { withInitialState } from "./withInitialState";

type AppStateContextProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
);

const appData: AppState = {
  draggedItem: undefined,
  lists: [
    {
      id: "0",
      text: "To Do",
      tasks: [{ id: "c0", text: "Generate app scaffold" }]
    },
    {
      id: "1",
      text: "In Progress",
      tasks: [{ id: "c2", text: "Learn Typescript" }]
    },
    {
      id: "2",
      text: "Done",
      tasks: [{ id: "c3", text: "Begin to use static typing" }]
    }
  ]
};

type Task = {
  id: string;
  text: string;
};

type List = {
  id: string;
  text: string;
  tasks: Task[];
};

export type AppState = {
  lists: List[];
  draggedItem: DragItem | undefined;
};

export const useAppState = () => {
  return useContext(AppStateContext);
};

type Action =
  | {
      type: "ADD_LIST";
      payload: string;
    }
  | {
      type: "ADD_TASK";
      payload: { text: string; listId: string };
    }
  | {
      type: "MOVE_LIST";
      payload: { dragIndex: number; hoverIndex: number };
    }
  | {
      type: "SET_DRAGGED_ITEM";
      payload: DragItem | undefined;
    }
  | {
      type: "MOVE_TASK";
      payload: {
        dragIndex: number;
        hoverIndex: number;
        sourceColumn: string;
        targetColumn: string;
      };
    };

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "ADD_LIST":
      return {
        ...state,
        lists: [
          ...state.lists,
          { id: nanoid(), text: action.payload, tasks: [] }
        ]
      };
    case "ADD_TASK":
      const targetLaneIndex = findItemIndexById(
        state.lists,
        action.payload.listId
      );
      const targetList = state.lists[targetLaneIndex];
      const updatedTargetList = {
        ...targetList,
        tasks: [
          ...targetList.tasks,
          {
            id: nanoid(),
            text: action.payload.text
          }
        ]
      };
      return {
        ...state,
        lists: overrideItemAtIndex(
          state.lists,
          updatedTargetList,
          targetLaneIndex
        )
      };
    case "MOVE_LIST":
      return {
        ...state,
        lists: moveItem(
          state.lists,
          action.payload.dragIndex,
          action.payload.hoverIndex
        )
      };
    case "SET_DRAGGED_ITEM":
      return {
        ...state,
        draggedItem: action.payload
      };
    case "MOVE_TASK":
      const {
        dragIndex,
        hoverIndex,
        sourceColumn,
        targetColumn
      } = action.payload;
      const sourceListIndex = findItemIndexById(state.lists, sourceColumn);
      const sourceList = state.lists[sourceListIndex];
      const sourceTask = sourceList.tasks[dragIndex];
      const updatedSourceList = {
        ...sourceList,
        tasks: removeItemAtIndex(sourceList.tasks, dragIndex)
      };
      const stateWithUpdatedSourceList = {
        ...state,
        lists: overrideItemAtIndex(
          state.lists,
          updatedSourceList,
          sourceListIndex
        )
      };
      const targetListIndex = findItemIndexById(state.lists, targetColumn);
      const targetList2 = stateWithUpdatedSourceList.lists[targetListIndex];
      const updatedTargetList2 = {
        ...targetList2,
        tasks: insertItemAtIndex(targetList2.tasks, hoverIndex, sourceTask)
      };
      return {
        ...stateWithUpdatedSourceList,
        lists: overrideItemAtIndex(
          stateWithUpdatedSourceList.lists,
          updatedTargetList2,
          targetListIndex
        )
      };
    default:
      return state;
  }
};

type AppStateProviderProps = {
  children: React.ReactChild;
  initialState: AppState;
};

export const AppStateProvider = withInitialState<AppStateProviderProps>(
  ({ children, initialState }) => {
    const [state, dispatch] = useReducer(appStateReducer, initialState);
    useEffect(() => {
      save(state);
    }, [state]);
    return (
      <AppStateContext.Provider value={{ state, dispatch }}>
        {children}
      </AppStateContext.Provider>
    );
  }
);
