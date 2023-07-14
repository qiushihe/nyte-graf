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

      const withRedStroke = CS.createStyle({ strokeWidth: 1, strokeColor: "#ff0000" });

      const circle = withRedStroke(
        CS.createCircle(this.inputMousePosition[0], this.inputMousePosition[1], 10)
      );

      const hLine = withRedStroke(
        CS.createPolyLine(
          [this.inputMousePosition[0] - 3, this.inputMousePosition[1]],
          [this.inputMousePosition[0] + 3, this.inputMousePosition[1]]
        )
      );

      const vLine = withRedStroke(
        CS.createPolyLine(
          [this.inputMousePosition[0], this.inputMousePosition[1] - 3],
          [this.inputMousePosition[0], this.inputMousePosition[1] + 3]
        )
      );

      const circleRef = CS.createRef();
      const hLineRef = CS.createRef();
      const vLineRef = CS.createRef();

      setTimeout(() => {
        this.mutateCanvasState([
          CS.addShapeInstance(circle, circleRef),
          CS.addShapeInstance(hLine, hLineRef),
          CS.addShapeInstance(vLine, vLineRef)
        ]);

        setTimeout(() => {
          this.mutateCanvasState([
            CS.removeShapeInstance(circleRef.id),
            CS.removeShapeInstance(hLineRef.id),
            CS.removeShapeInstance(vLineRef.id)
          ]);
        }, 1000);
      }, 1);
    }
  }

  public setInputMousePosition(x: number, y: number) {
    this.inputMousePosition = [x, y];
  }

  public mutateCanvasState(fns: ((input: State) => State)[]) {
    const mutateCanvasState = CS.mutator(fns);
    this.canvasState = mutateCanvasState(this.canvasState);
    this.render();
  }

  public render() {
    const renderCanvasState = canvasRenderer(this.canvas);
    renderCanvasState(this.canvasState);
  }
}

// Polygon intersections: https://github.com/thelonious/kld-intersections

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

  const withBlackStroke = CS.createStyle({ strokeWidth: 1, strokeColor: "#000000" });
  const withRedStroke = CS.createStyle({ strokeWidth: 1, strokeColor: "#ff0000" });
  const withGreenFill = CS.createStyle({ fillColor: "#00ff00" });

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

  stateMachine.mutateCanvasState([
    CS.setBackgroundColor("rgba(169,169,169)"),
    CS.addShapeInstance(withBlackStroke(CS.createRectangle(10, 10, 100, 100))),
    CS.addShapeInstance(withGreenFill(CS.createCircle(300, 110, 100))),
    CS.addShapeInstance(withRedStroke(CS.createPolyLine([10, 200], [200, 200], [200, 250])))
  ]);
};

setTimeout(() => main("nyte-graf-root"), 1);
