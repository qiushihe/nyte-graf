import { handleActions } from "redux-actions";

import { ADD_RECTANGLE } from "../../action/shapes";
import { ADD_CIRCLE } from "../../action/shapes";
import { ADD_POLY_LINE } from "../../action/shapes";
import { UPDATE_SHAPE_STYLE } from "../../action/shapes";
import { REMOVE_SHAPE } from "../../action/shapes";
import { RootState } from "../../store.type";
import { addCircle } from "./add-circle";
import { addPolyLine } from "./add-poly-line";
import { addRectangle } from "./add-rectangle";
import { removeShape } from "./remove-shape";
import { updateShapeStyle } from "./update-shape-style";

export const shapesReducer = handleActions<RootState["shapes"], unknown>(
  {
    [ADD_RECTANGLE]: addRectangle,
    [ADD_CIRCLE]: addCircle,
    [ADD_POLY_LINE]: addPolyLine,
    [UPDATE_SHAPE_STYLE]: updateShapeStyle,
    [REMOVE_SHAPE]: removeShape
  },
  []
);
