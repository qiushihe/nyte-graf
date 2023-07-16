import { AnyAction, Middleware } from "@reduxjs/toolkit";

import { uuidV4 } from "~nyte-graf-core/util/uuid-v4";

import { MOUSE_CLICK } from "../../action/mouse-position";
import { addCircle } from "../../action/shapes";
import { addPolyLine } from "../../action/shapes";
import { updateShapeStyle } from "../../action/shapes";
import { removeShape } from "../../action/shapes";
import { positionX } from "../../selector/mouse-position";
import { positionY } from "../../selector/mouse-position";

let markerTimeout: NodeJS.Timeout | null = null;
let circleId: string | null = null;
let hLineId: string | null = null;
let vLineId: string | null = null;

export const clickMarkerMiddleware: Middleware = (store) => (next) => (action: AnyAction) => {
  if (action.type === MOUSE_CLICK) {
    const storeState = store.getState();
    const mousePositionX = positionX(storeState);
    const mousePositionY = positionY(storeState);

    next(action);

    const clearMarker = () => {
      store.dispatch(removeShape(circleId));
      store.dispatch(removeShape(hLineId));
      store.dispatch(removeShape(vLineId));

      clearTimeout(markerTimeout);
      markerTimeout = null;
    };

    const renderMarker = () => {
      if (markerTimeout) {
        clearMarker();
      }

      circleId = uuidV4();
      hLineId = uuidV4();
      vLineId = uuidV4();

      store.dispatch(addCircle(circleId, mousePositionX, mousePositionY, 10));
      store.dispatch(
        addPolyLine(hLineId, [
          [mousePositionX - 3, mousePositionY],
          [mousePositionX + 3, mousePositionY]
        ])
      );
      store.dispatch(
        addPolyLine(vLineId, [
          [mousePositionX, mousePositionY - 3],
          [mousePositionX, mousePositionY + 3]
        ])
      );
      store.dispatch(updateShapeStyle(circleId, { strokeColor: "#ff0000" }));
      store.dispatch(updateShapeStyle(hLineId, { strokeColor: "#ff0000" }));
      store.dispatch(updateShapeStyle(vLineId, { strokeColor: "#ff0000" }));

      markerTimeout = setTimeout(clearMarker, 1000);
    };

    setTimeout(renderMarker, 1);
  } else {
    next(action);
  }
};
