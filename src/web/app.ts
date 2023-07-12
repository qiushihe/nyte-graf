import debounce from "lodash/fp/debounce";

import * as CR from "./canvas/render";
import * as CS from "./canvas/state";

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

  const blackStroke = CS.style({ strokeWidth: 1, strokeColor: "#000000" });
  const redStroke = CS.style({ strokeWidth: 1, strokeColor: "#ff0000" });

  const greenFill = CS.style({ fillColor: "#00ff00" });

  const mutateCanvasState = CS.mutator([
    CS.instance(blackStroke(CS.rectangle(10, 10, 100, 100))),
    CS.instance(greenFill(CS.circle(300, 110, 100))),
    CS.instance(redStroke(CS.polyLine([10, 200], [200, 200], [200, 250])))
  ]);

  const canvasState = mutateCanvasState(CS.state());

  const renderCanvasState = CR.renderer(canvas);

  renderCanvasState(canvasState);
};

setTimeout(() => main("nyte-graf-root"), 1);
