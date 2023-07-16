import { WaitPayload } from "~nyte-graf-web/canvas-state/action/wait";
import { CanvasState } from "~nyte-graf-web/canvas-state/canvas-state.type";
import { StateMachineReducer } from "~nyte-graf-web/state-machine/state-machine.type";

const handleWait: StateMachineReducer<CanvasState, WaitPayload> = {
  types: ["wait"],
  apply: (state, action) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(state), action.payload.ms);
    });
  }
};

export const appReducers = [handleWait];
