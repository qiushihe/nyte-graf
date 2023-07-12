import debounce from "lodash/fp/debounce";

import { uuidV4 } from "~nyte-graf-core/util/uuid-v4";

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
  points: { posX: number; posY: number }[];
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

  console.log(canvasState);

  canvasState.shapes.forEach((shape) => {
    // ctx.scale(1, 1);
    // ctx.translate(100, 100);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;

    if (shape.type === "rectangle") {
      ctx.strokeRect(shape.posX, shape.posY, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.posX, shape.posY, shape.radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else {
      console.error("Unknown shape:", shape);
    }
  });

  // ctx.fillRect(25, 25, 100, 100);
  // ctx.clearRect(45, 45, 60, 60);
  // ctx.strokeRect(50, 50, 50, 50);
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
    shapes: [
      {
        type: "rectangle",
        layerId: "layer-lol",
        id: uuidV4(),
        posX: 10,
        posY: 10,
        width: 100,
        height: 100
      },
      {
        type: "circle",
        layerId: "layer-lol",
        id: uuidV4(),
        posX: 300,
        posY: 110,
        radius: 100
      },
      {
        type: "poly-line",
        layerId: "layer-lol",
        id: uuidV4(),
        points: [
          { posX: 100, posY: 0 },
          { posX: 100, posY: 20 },
          { posX: 100, posY: 100 }
        ]
      }
    ]
  });
};

setTimeout(() => main("nyte-graf-root"), 1);
