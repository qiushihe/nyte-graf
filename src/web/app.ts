import debounce from "lodash/fp/debounce";

type CanvasLayer = { id: string };

type CanvasShapeRectangle = {
  type: "rectangle";
  posX: number;
  posY: number;
  width: number;
  height: number;
};

type CanvasShapeCircle = { type: "circle"; posX: number; posY: number; radius: number };

type CanvasShapePolyLine = {
  type: "poly-line";
  segments: { fromX: number; fromY: number; toX: number; toY: number }[];
};

type CanvasShape = { id: string; layerId: string } & (
  | CanvasShapeRectangle
  | CanvasShapeCircle
  | CanvasShapePolyLine
);

type CanvasState = {
  layerOrder: string[];
  layers: CanvasLayer[];
  shapes: CanvasShape[];
};

const canvasStateRenderer = (canvas: HTMLCanvasElement) => (canvasState: CanvasState) => {
  const ctx = canvas.getContext("2d");

  ctx.fillRect(25, 25, 100, 100);
  ctx.clearRect(45, 45, 60, 60);
  ctx.strokeRect(50, 50, 50, 50);
};

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

  const renderCanvasState = canvasStateRenderer(canvas);

  renderCanvasState({
    layerOrder: [],
    layers: [],
    shapes: []
  });
};

setTimeout(() => main("nyte-graf-root"), 1);
