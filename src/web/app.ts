import debounce from "lodash/fp/debounce";

import { State } from "~nyte-graf-web/canvas/canvas.type";
import { shapeClickedOnDetector } from "~nyte-graf-web/canvas/click";
import { renderer as canvasRenderer } from "~nyte-graf-web/canvas/render";
import * as CS from "~nyte-graf-web/canvas/state";

class CanvasStateMachine {
  // Canvas and its state
  private readonly canvas: HTMLCanvasElement;
  private canvasState: State;

  // Input variables
  private inputHasMouse: boolean;
  private inputIsMouseDown: boolean;
  private inputMousePosition: [number, number];

  // Machine states
  private stateIsRunning: boolean;

  public constructor(canvas: HTMLCanvasElement, canvasState?: State) {
    // Canvas and its state
    this.canvas = canvas;
    this.canvasState = canvasState || CS.initialState();

    // Input variables
    this.inputHasMouse = false;
    this.inputIsMouseDown = false;
    this.inputMousePosition = [0, 0];

    // Machine states
    this.stateIsRunning = false;
  }

  public setInputHasMouse(hasMouse: boolean) {
    this.inputHasMouse = hasMouse;

    if (this.inputHasMouse) {
      this.stateIsRunning = true;
    } else {
      this.stateIsRunning = false;
    }
  }

  public setInputIsMouseDown(mouseDown: boolean) {
    this.inputIsMouseDown = mouseDown;

    if (this.inputIsMouseDown) {
      const clickedOnShape = shapeClickedOnDetector(
        this.inputMousePosition[0],
        this.inputMousePosition[1],
        10,
        16
      );

      this.canvasState.shapes.forEach((shape) => {
        if (clickedOnShape(shape)) {
          console.log("Clicked on shape:", shape);
        }
      });

      const circleRef = CS.createRef();
      const hLineRef = CS.createRef();
      const vLineRef = CS.createRef();

      setTimeout(() => {
        this.mutateCanvasState([
          CS.addCircle([this.inputMousePosition[0], this.inputMousePosition[1], 10], circleRef),
          CS.addPolyLine(
            [
              [this.inputMousePosition[0] - 3, this.inputMousePosition[1]],
              [this.inputMousePosition[0] + 3, this.inputMousePosition[1]]
            ],
            hLineRef
          ),
          CS.addPolyLine(
            [
              [this.inputMousePosition[0], this.inputMousePosition[1] - 3],
              [this.inputMousePosition[0], this.inputMousePosition[1] + 3]
            ],
            vLineRef
          ),

          CS.updateShapeStyle(circleRef, { strokeWidth: 1, strokeColor: "#ff0000" }),
          CS.updateShapeStyle(hLineRef, { strokeWidth: 1, strokeColor: "#ff0000" }),
          CS.updateShapeStyle(vLineRef, { strokeWidth: 1, strokeColor: "#ff0000" })
        ]);

        setTimeout(() => {
          this.mutateCanvasState([
            CS.removeShape(circleRef.id),
            CS.removeShape(hLineRef.id),
            CS.removeShape(vLineRef.id)
          ]);
        }, 1000);
      }, 1);
    }
  }

  public setInputMousePosition(x: number, y: number) {
    this.inputMousePosition = [x, y];
  }

  public mutateCanvasState(fns: ((input: State) => State)[]) {
    const mutateCanvasState = CS.stateMutator(fns);
    this.canvasState = mutateCanvasState(this.canvasState);
    this.render();
  }

  public render() {
    const renderCanvasState = canvasRenderer(this.canvas);
    renderCanvasState(this.canvasState);
  }
}

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

  canvas.addEventListener("mouseenter", () => stateMachine.setInputHasMouse(true));
  canvas.addEventListener("mouseleave", () => stateMachine.setInputHasMouse(false));
  canvas.addEventListener("mousedown", () => stateMachine.setInputIsMouseDown(true));
  canvas.addEventListener("mouseup", () => stateMachine.setInputIsMouseDown(false));
  canvas.addEventListener("mousemove", (evt) =>
    stateMachine.setInputMousePosition(
      evt.x - canvas.getBoundingClientRect().x,
      evt.y - canvas.getBoundingClientRect().y
    )
  );

  const rectangleRef = CS.createRef();
  const circleRef = CS.createRef();
  const polyLineRef = CS.createRef();

  stateMachine.mutateCanvasState([
    CS.setBackgroundColor("rgba(169,169,169)"),
    CS.addRectangle([10, 10, 100, 100], rectangleRef),
    CS.addCircle([150, 110, 100], circleRef),
    CS.addPolyLine(
      [
        [60, 170],
        [250, 170],
        [250, 220]
      ],
      polyLineRef
    ),

    CS.updateShapeStyle(rectangleRef, { strokeWidth: 1, strokeColor: "#000000" }),
    CS.updateShapeStyle(circleRef, { fillColor: "#00ff00" }),
    CS.updateShapeStyle(polyLineRef, { strokeWidth: 1, strokeColor: "#ff0000" })
  ]);
};

setTimeout(() => main("nyte-graf-root"), 1);
