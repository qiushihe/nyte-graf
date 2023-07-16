import { StateMachineAction } from "~nyte-graf-web/state-machine/state-machine.type";

export type RemoveShapePayload = {
  id: string;
};

export const removeShape = (id: string): StateMachineAction<RemoveShapePayload> => {
  return {
    type: "remove-shape",
    payload: { id }
  };
};
