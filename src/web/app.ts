import debounce from "lodash/fp/debounce";

import { State } from "~nyte-graf-web/canvas/canvas.type";
import { RefRegistry } from "~nyte-graf-web/canvas/canvas.type";
import { shapeClickedOnDetector } from "~nyte-graf-web/canvas/click";
import { createRefRegistry } from "~nyte-graf-web/canvas/ref";
import { renderer as canvasRenderer } from "~nyte-graf-web/canvas/render";
import * as CS from "~nyte-graf-web/canvas/state";

enum CanvasStateMachineEventName {
  MouseDown = "mousedown",
  MouseUp = "mouseup"
}

type CanvasStateMachineEventPayload = {
  [CanvasStateMachineEventName.MouseDown]: { posX: number; posY: number };
  [CanvasStateMachineEventName.MouseUp]: { posX: number; posY: number; downTime: number };
};

type CanvasStateMachineEvent<TEventName extends CanvasStateMachineEventName> = {
  type: TEventName;
  payload: CanvasStateMachineEventPayload[TEventName];
};

class CanvasStateMachine {
  // Canvas and its state
  private readonly canvas: HTMLCanvasElement;
  private canvasState: State;
  private canvasRefs: RefRegistry;

  // Input variables
  private inputHasMouse: boolean;
  private inputIsMouseDown: boolean;
  private inputMousePosition: [number, number];

  // Machine states
  private stateIsRunning: boolean;
  private clearClickMarkerTimeout: NodeJS.Timeout | null;

  public constructor(canvas: HTMLCanvasElement, canvasState?: State) {
    // Canvas and its state
    this.canvas = canvas;
    this.canvasState = canvasState || CS.initialState();
    this.canvasRefs = createRefRegistry();

    // Input variables
    this.inputHasMouse = false;
    this.inputIsMouseDown = false;
    this.inputMousePosition = [0, 0];

    // Machine states
    this.stateIsRunning = false;
    this.clearClickMarkerTimeout = null;

    canvas.addEventListener("mouseenter", () => this.setInputHasMouse(true));
    canvas.addEventListener("mouseleave", () => this.setInputHasMouse(false));
    canvas.addEventListener("mousedown", () => this.setInputIsMouseDown(true));
    canvas.addEventListener("mouseup", () => this.setInputIsMouseDown(false));
    canvas.addEventListener("mousemove", (evt) =>
      this.setInputMousePosition(
        evt.x - canvas.getBoundingClientRect().x,
        evt.y - canvas.getBoundingClientRect().y
      )
    );
  }

  public addEventListener<TEventName extends CanvasStateMachineEventName>(
    evtName: TEventName,
    handler: (evt: CanvasStateMachineEvent<TEventName>, machine: CanvasStateMachine) => void
  ) {}

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

      setTimeout(() => {
        if (this.clearClickMarkerTimeout) {
          this.mutateCanvasState([
            CS.removeShape(this.canvasRefs.get("click-marker-circle")),
            CS.removeShape(this.canvasRefs.get("click-marker-h-line")),
            CS.removeShape(this.canvasRefs.get("click-marker-v-line"))
          ]);
          clearTimeout(this.clearClickMarkerTimeout);
          this.clearClickMarkerTimeout = null;
        }

        this.mutateCanvasState([
          CS.addCircle(
            [this.inputMousePosition[0], this.inputMousePosition[1], 10],
            this.canvasRefs.get("click-marker-circle")
          ),
          CS.addPolyLine(
            [
              [this.inputMousePosition[0] - 3, this.inputMousePosition[1]],
              [this.inputMousePosition[0] + 3, this.inputMousePosition[1]]
            ],
            this.canvasRefs.get("click-marker-h-line")
          ),
          CS.addPolyLine(
            [
              [this.inputMousePosition[0], this.inputMousePosition[1] - 3],
              [this.inputMousePosition[0], this.inputMousePosition[1] + 3]
            ],
            this.canvasRefs.get("click-marker-v-line")
          ),

          CS.updateShapeStyle(this.canvasRefs.get("click-marker-circle"), {
            strokeWidth: 1,
            strokeColor: "#ff0000"
          }),
          CS.updateShapeStyle(this.canvasRefs.get("click-marker-h-line"), {
            strokeWidth: 1,
            strokeColor: "#ff0000"
          }),
          CS.updateShapeStyle(this.canvasRefs.get("click-marker-v-line"), {
            strokeWidth: 1,
            strokeColor: "#ff0000"
          })
        ]);

        this.clearClickMarkerTimeout = setTimeout(() => {
          this.mutateCanvasState([
            CS.removeShape(this.canvasRefs.get("click-marker-circle")),
            CS.removeShape(this.canvasRefs.get("click-marker-h-line")),
            CS.removeShape(this.canvasRefs.get("click-marker-v-line"))
          ]);
          this.clearClickMarkerTimeout = null;
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

  stateMachine.addEventListener(CanvasStateMachineEventName.MouseDown, (evt) => {
    console.log(evt);
  });

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
