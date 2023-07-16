import { ReducerMapValue } from "redux-actions";

import { RootState } from "../../store.type";

export const resetColor: ReducerMapValue<RootState["backgroundColor"], never> = () => {
  return "#ffffff";
};
