import { ReducerMapValue } from "redux-actions";

import { SetColorPayload } from "~nyte-graf-web/redux/action/background-color.type";

import { RootState } from "../../store.type";

export const setColor: ReducerMapValue<RootState["backgroundColor"], SetColorPayload> = (
  state,
  action
) => {
  return action.payload.color;
};
