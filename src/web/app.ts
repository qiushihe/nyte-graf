import debounce from "lodash/fp/debounce";

import { uuidV4 } from "~nyte-graf-core/util/uuid-v4";
import { canvasRenderer } from "~nyte-graf-web/canvas/renderer";
import { setColor as setBackgroundColor } from "~nyte-graf-web/redux/action/background-color";
import { mouseClick, mouseMove } from "~nyte-graf-web/redux/action/mouse-position";
import { addRectangle } from "~nyte-graf-web/redux/action/shapes";
import { addCircle } from "~nyte-graf-web/redux/action/shapes";
import { addPolyLine } from "~nyte-graf-web/redux/action/shapes";
import { updateShapeStyle } from "~nyte-graf-web/redux/action/shapes";
import { createStore } from "~nyte-graf-web/redux/store";

const with30Fps = debounce(1000 / 30);

const with60Fps = debounce(1000 / 60);

type MainOptions = {
  rootElementId: string;
  fps: 30 | 60;
};

const main = (options: MainOptions) => {
  const nyteGrafRoot = document.getElementById(options.rootElementId);

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

  const store = createStore();

  store.subscribe(
    (options.fps === 60 ? with60Fps : with30Fps)(() => {
      // console.log("store update", store.getState());
      renderCanvas(store.getState());
    })
  );

  canvas.addEventListener("mousemove", (evt) => {
    store.dispatch(
      mouseMove(evt.x - canvas.getBoundingClientRect().x, evt.y - canvas.getBoundingClientRect().y)
    );
  });

  canvas.addEventListener("mouseup", () => {
    store.dispatch(mouseClick());
  });

  store.dispatch(setBackgroundColor("#696969"));

  const rectangleId = uuidV4();
  const circleId = uuidV4();
  const polyLineId = uuidV4();

  store.dispatch(addRectangle(rectangleId, 10, 10, 100, 100));
  store.dispatch(updateShapeStyle(rectangleId, { strokeWidth: 1, strokeColor: "#000000" }));
  store.dispatch(addCircle(circleId, 150, 110, 100));
  store.dispatch(updateShapeStyle(circleId, { fillColor: "#00ff00" }));
  store.dispatch(
    addPolyLine(polyLineId, [
      [60, 170],
      [250, 170],
      [250, 220]
    ])
  );
  store.dispatch(updateShapeStyle(polyLineId, { strokeWidth: 1, strokeColor: "#ff0000" }));
};

setTimeout(() => main({ rootElementId: "nyte-graf-root", fps: 60 }), 1);
