import { StateMachineAction } from "~nyte-graf-web/state-machine/state-machine.type";

export const mouseClick = (): StateMachineAction<never> => {
  return {
    type: "mouse-click"
  };
};
