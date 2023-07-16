import { MOUSE_MOVE } from "./action/mouse-position";

export const getDevToolOptions = (isEnabled: boolean) => {
  if (isEnabled) {
    return {
      actionsDenylist: [MOUSE_MOVE]
    };
  } else {
    return false;
  }
};
