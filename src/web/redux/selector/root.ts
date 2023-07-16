import get from "lodash/fp/get";

import { RootState } from "../store.type";

export const mousePosition: (state: RootState) => RootState["mousePosition"] = get("mousePosition");

export const shapes: (state: RootState) => RootState["shapes"] = get("shapes");
