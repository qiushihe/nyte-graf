import { SetBackgroundColorPayload } from "~nyte-graf-web/canvas-state/action/set-background-color";
import { CanvasState } from "~nyte-graf-web/canvas-state/canvas-state.type";
import { StateMachineReducer } from "~nyte-graf-web/state-machine/state-machine.type";

const handleSetBackgroundColor: StateMachineReducer<CanvasState, SetBackgroundColorPayload> = {
  types: ["set-background-color"],
  apply: (state, action) => {
    return {
      ...state,
      backgroundColor: action.payload.color
    };
  }
};

export const backgroundColorReducers = [handleSetBackgroundColor];
