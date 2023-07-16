import debounce from "lodash/fp/debounce";

import { uuidV4 } from "~nyte-graf-core/util/uuid-v4";
import { addCircle } from "~nyte-graf-web/canvas-state/action/add-circle";
import { addPolyLine } from "~nyte-graf-web/canvas-state/action/add-poly-line";
import { addRectangle } from "~nyte-graf-web/canvas-state/action/add-rectangle";
import { init } from "~nyte-graf-web/canvas-state/action/init";
import { mouseClick } from "~nyte-graf-web/canvas-state/action/mouse-click";
import { mouseMove } from "~nyte-graf-web/canvas-state/action/mouse-move";
import { setBackgroundColor } from "~nyte-graf-web/canvas-state/action/set-background-color";
import { updateShapeStyle } from "~nyte-graf-web/canvas-state/action/update-shape-style";
import { canvasRenderer } from "~nyte-graf-web/canvas-state/canvas-render";
import { CanvasState } from "~nyte-graf-web/canvas-state/canvas-state.type";
import { clickMarkerMiddleware } from "~nyte-graf-web/canvas-state/middleware/click-marker";
import { clickedOnMiddleware } from "~nyte-graf-web/canvas-state/middleware/clicked-on";
import { backgroundColorReducers } from "~nyte-graf-web/canvas-state/reducer/background-color";
import { mousePositionReducers } from "~nyte-graf-web/canvas-state/reducer/mouse-position";
import { shapesReducers } from "~nyte-graf-web/canvas-state/reducer/shapes";
import { StateMachine } from "~nyte-graf-web/state-machine/state-machine";

const main = (rootElementId: string) => {
  const nyteGrafRoot = document.getElementById(rootElementId);

  const canvas = document.createElement("canvas");
  canvas.style.display = "block";
  nyteGrafRoot.appendChild(canvas);

  const resizeCanvas = () => {
    canvas.width = nyteGrafRoot.clientWidth;
    canvas.height = nyteGrafRoot.clientHeight;
  };

  window.addEventListener("resize", debounce(100)(resizeCanvas), false);
  resizeCanvas();

  const renderCanvas = canvasRenderer(canvas);

  const stateMachine = new StateMachine<CanvasState>(
    {
      mousePosition: { x: -1, y: -1 },
      backgroundColor: "#ffffff",
      layerOrder: [],
      layers: [],
      shapes: []
    },
    [...mousePositionReducers, ...backgroundColorReducers, ...shapesReducers],
    [clickMarkerMiddleware(renderCanvas), clickedOnMiddleware]
  );

  canvas.addEventListener("mousemove", (evt) => {
    stateMachine.dispatch([
      mouseMove(evt.x - canvas.getBoundingClientRect().x, evt.y - canvas.getBoundingClientRect().y)
    ]);
  });

  canvas.addEventListener("mouseup", () => {
    stateMachine.dispatch([mouseClick()]);
  });

  const rectangleId = uuidV4();
  const circleId = uuidV4();
  const polyLineId = uuidV4();

  stateMachine.dispatch([
    init(),
    setBackgroundColor("#696969"),
    addRectangle(rectangleId, 10, 10, 100, 100),
    addCircle(circleId, 150, 110, 100),
    addPolyLine(polyLineId, [
      [60, 170],
      [250, 170],
      [250, 220]
    ]),
    updateShapeStyle(rectangleId, { strokeWidth: 1, strokeColor: "#000000" }),
    updateShapeStyle(circleId, { fillColor: "#00ff00" }),
    updateShapeStyle(polyLineId, { strokeWidth: 1, strokeColor: "#ff0000" })
  ]);

  renderCanvas(stateMachine.getState());
};

setTimeout(() => main("nyte-graf-root"), 1);
