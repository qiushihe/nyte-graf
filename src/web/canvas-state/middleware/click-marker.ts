import { uuidV4 } from "~nyte-graf-core/util/uuid-v4";
import { addCircle } from "~nyte-graf-web/canvas-state/action/add-circle";
import { addPolyLine } from "~nyte-graf-web/canvas-state/action/add-poly-line";
import { removeShape } from "~nyte-graf-web/canvas-state/action/remove-shape";
import { updateShapeStyle } from "~nyte-graf-web/canvas-state/action/update-shape-style";
import { CanvasState } from "~nyte-graf-web/canvas-state/canvas-state.type";
import { mousePositionX } from "~nyte-graf-web/canvas-state/selector/mouse-position";
import { mousePositionY } from "~nyte-graf-web/canvas-state/selector/mouse-position";
import { StateMachineMiddleware } from "~nyte-graf-web/state-machine/state-machine.type";

let markerTimeout: NodeJS.Timeout | null = null;
let circleId: string | null = null;
let hLineId: string | null = null;
let vLineId: string | null = null;

export const clickMarkerMiddleware = (
  renderCanvas: (state: CanvasState) => void
): StateMachineMiddleware<CanvasState> => ({
  types: ["mouse-click"],
  apply: (machine, next, action) => {
    const mouseX = machine.query(mousePositionX);
    const mouseY = machine.query(mousePositionY);

    next(action);

    const clearMarker = () => {
      machine.dispatch(
        [removeShape(circleId), removeShape(hLineId), removeShape(vLineId)],
        (machine) => {
          renderCanvas(machine.getState());
        }
      );

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

      machine.dispatch(
        [
          addCircle(circleId, mouseX, mouseY, 10),
          addPolyLine(hLineId, [
            [mouseX - 3, mouseY],
            [mouseX + 3, mouseY]
          ]),
          addPolyLine(vLineId, [
            [mouseX, mouseY - 3],
            [mouseX, mouseY + 3]
          ]),
          updateShapeStyle(circleId, { strokeColor: "#ff0000" }),
          updateShapeStyle(hLineId, { strokeColor: "#ff0000" }),
          updateShapeStyle(vLineId, { strokeColor: "#ff0000" })
        ],
        (machine) => {
          renderCanvas(machine.getState());
        }
      );

      markerTimeout = setTimeout(clearMarker, 1000);
    };

    setTimeout(renderMarker, 1);
  }
});
