import { StateMachineAction } from "~nyte-graf-web/state-machine/state-machine.type";

export type SetBackgroundColorPayload = { color: string };

export const setBackgroundColor = (
  color: string
): StateMachineAction<SetBackgroundColorPayload> => {
  return {
    type: "set-background-color",
    payload: { color }
  };
};
