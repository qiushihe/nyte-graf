import { StateMachineAction } from "~nyte-graf-web/state-machine/state-machine.type";

export type WaitPayload = { ms: number };

export const wait = (ms: number): StateMachineAction<WaitPayload> => {
  return {
    type: "wait",
    payload: { ms }
  };
};
