import { State } from "./canvas.type";
import { RefRegistry } from "./canvas.type";
import { shapeClickedOnDetector } from "./click";
import { createRefRegistry } from "./ref";
import { renderer as canvasRenderer } from "./render";
import * as CS from "./state";

export class CanvasStateMachine {
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
      setTimeout(this.renderClickMarker.bind(this), 1);
    }

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

  private renderClickMarker() {
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

    this.clearClickMarkerTimeout = setTimeout(this.clearClickMarker.bind(this), 1000);
  }

  private clearClickMarker() {
    this.mutateCanvasState([
      CS.removeShape(this.canvasRefs.get("click-marker-circle")),
      CS.removeShape(this.canvasRefs.get("click-marker-h-line")),
      CS.removeShape(this.canvasRefs.get("click-marker-v-line"))
    ]);
    this.clearClickMarkerTimeout = null;
  }
}
