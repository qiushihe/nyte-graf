import { StateMachineAction } from "~nyte-graf-web/state-machine/state-machine.type";

export type MouseMovePayload = { x: number; y: number };

export const mouseMove = (x: number, y: number): StateMachineAction<MouseMovePayload> => {
  return {
    type: "mouse-move",
    payload: { x, y }
  };
};
