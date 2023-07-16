import { CanvasState } from "~nyte-graf-web/canvas-state/canvas-state.type";
import { Shape } from "~nyte-graf-web/canvas-state/canvas-state.type";
import { mousePositionX } from "~nyte-graf-web/canvas-state/selector/mouse-position";
import { mousePositionY } from "~nyte-graf-web/canvas-state/selector/mouse-position";
import { polygonCollideWithPolygon } from "~nyte-graf-web/polygon/collide";
import { polygonCollideWithPolyLine } from "~nyte-graf-web/polygon/collide";
import { circleToPolygon } from "~nyte-graf-web/polygon/convert";
import { Coordinate, Polygon } from "~nyte-graf-web/polygon/polygon.type";
import { StateMachineMiddleware } from "~nyte-graf-web/state-machine/state-machine.type";

export const clickedOnDetector = (
  clickX: number,
  clickY: number,
  toleranceRadius: number,
  toleranceEdges: number
): ((shape: Shape) => boolean) => {
  const clickCircle = circleToPolygon(clickX, clickY, toleranceRadius, toleranceEdges);

  return (shape) => {
    if (shape.type === "rectangle") {
      const shapePolygon: Polygon = [
        [shape.posX, shape.posY],
        [shape.posX + shape.width, shape.posY],
        [shape.posX + shape.width, shape.posY + shape.height],
        [shape.posX, shape.posY + shape.height]
      ];
      return polygonCollideWithPolygon(clickCircle, shapePolygon);
    } else if (shape.type === "circle") {
      const shapePolygon: Polygon = circleToPolygon(shape.posX, shape.posY, shape.radius, 128);
      return polygonCollideWithPolygon(clickCircle, shapePolygon);
    } else if (shape.type === "poly-line") {
      const shapePoints = shape.points.map(({ posX, posY }) => [posX, posY] as Coordinate);
      return polygonCollideWithPolyLine(clickCircle, shapePoints);
    } else {
      return false;
    }
  };
};

export const clickedOnMiddleware: StateMachineMiddleware<CanvasState> = {
  types: ["mouse-click"],
  apply: (machine, next, action) => {
    const mouseX = machine.query(mousePositionX);
    const mouseY = machine.query(mousePositionY);

    next(action);

    const clickedOnShape = clickedOnDetector(mouseX, mouseY, 10, 16);

    machine.getState().shapes.forEach((shape) => {
      if (clickedOnShape(shape)) {
        console.log("Clicked on shape:", shape);
      }
    });
  }
};
