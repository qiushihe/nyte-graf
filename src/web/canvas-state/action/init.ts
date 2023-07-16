import { StateMachineAction } from "~nyte-graf-web/state-machine/state-machine.type";

export const init = (): StateMachineAction<never> => {
  return {
    type: "__INIT__"
  };
};
