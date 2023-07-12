import debounce from "lodash/fp/debounce";

import * as CR from "./canvas/render";
import * as CS from "./canvas/state";

class CanvasStateMachine {
  // Canvas and its state
  private readonly canvas: HTMLCanvasElement;
  private canvasState: CS.State;

  // Input variables
  private inputHasMouse: boolean;
  private inputIsMouseDown: boolean;
  private inputMousePosition: [number, number];

  // Machine states
  private stateIsRunning: boolean;

  public constructor(canvas: HTMLCanvasElement, canvasState?: CS.State) {
    // Canvas and its state
    this.canvas = canvas;
    this.canvasState = canvasState || CS.state();

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
      const redStroke = CS.style({ strokeWidth: 1, strokeColor: "#ff0000" });

      const circle = redStroke(
        CS.circle(this.inputMousePosition[0], this.inputMousePosition[1], 10)
      );

      const hLine = redStroke(
        CS.polyLine(
          [this.inputMousePosition[0] - 3, this.inputMousePosition[1]],
          [this.inputMousePosition[0] + 3, this.inputMousePosition[1]]
        )
      );

      const vLine = redStroke(
        CS.polyLine(
          [this.inputMousePosition[0], this.inputMousePosition[1] - 3],
          [this.inputMousePosition[0], this.inputMousePosition[1] + 3]
        )
      );

      const circleRef = CS.ref();
      const hLineRef = CS.ref();
      const vLineRef = CS.ref();

      setTimeout(() => {
        this.mutateCanvasState([
          CS.instance(circle, circleRef),
          CS.instance(hLine, hLineRef),
          CS.instance(vLine, vLineRef)
        ]);

        setTimeout(() => {
          this.mutateCanvasState([
            CS.remove(circleRef.id),
            CS.remove(hLineRef.id),
            CS.remove(vLineRef.id)
          ]);
        }, 1000);
      }, 1);
    }
  }

  public setInputMousePosition(x: number, y: number) {
    this.inputMousePosition = [x, y];
  }

  public mutateCanvasState(fns: ((input: CS.State) => CS.State)[]) {
    const mutateCanvasState = CS.mutator(fns);
    this.canvasState = mutateCanvasState(this.canvasState);
    this.render();
  }

  public render() {
    const renderCanvasState = CR.renderer(this.canvas);
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

  const blackStroke = CS.style({ strokeWidth: 1, strokeColor: "#000000" });
  const redStroke = CS.style({ strokeWidth: 1, strokeColor: "#ff0000" });
  const greenFill = CS.style({ fillColor: "#00ff00" });

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
    CS.backgroundColor("rgba(169,169,169)"),
    CS.instance(blackStroke(CS.rectangle(10, 10, 100, 100))),
    CS.instance(greenFill(CS.circle(300, 110, 100))),
    CS.instance(redStroke(CS.polyLine([10, 200], [200, 200], [200, 250])))
  ]);
};

setTimeout(() => main("nyte-graf-root"), 1);
