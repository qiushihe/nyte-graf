import debounce from "lodash/fp/debounce";

import { createRefRegistry } from "~nyte-graf-web/canvas/ref";
import * as CS from "~nyte-graf-web/canvas/state";
import { CanvasStateMachine } from "~nyte-graf-web/canvas/state-machine";

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

  const stateMachine = new CanvasStateMachine(canvas);
  const refs = createRefRegistry();

  stateMachine.mutateCanvasState([
    CS.setBackgroundColor("rgba(169,169,169)"),
    CS.addRectangle([10, 10, 100, 100], refs.get("rectangle")),
    CS.addCircle([150, 110, 100], refs.get("circle")),
    CS.addPolyLine(
      [
        [60, 170],
        [250, 170],
        [250, 220]
      ],
      refs.get("poly-line")
    ),

    CS.updateShapeStyle(refs.get("rectangle"), { strokeWidth: 1, strokeColor: "#000000" }),
    CS.updateShapeStyle(refs.get("circle"), { fillColor: "#00ff00" }),
    CS.updateShapeStyle(refs.get("poly-line"), { strokeWidth: 1, strokeColor: "#ff0000" })
  ]);
};

setTimeout(() => main("nyte-graf-root"), 1);
