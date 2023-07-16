import { AnyAction, Middleware } from "@reduxjs/toolkit";

import { polygonCollideWithPolygon } from "~nyte-graf-web/polygon/collide";
import { polygonCollideWithPolyLine } from "~nyte-graf-web/polygon/collide";
import { circleToPolygon } from "~nyte-graf-web/polygon/convert";
import { Coordinate, Polygon } from "~nyte-graf-web/polygon/polygon.type";

import { MOUSE_CLICK } from "../../action/mouse-position";
import { positionX } from "../../selector/mouse-position";
import { positionY } from "../../selector/mouse-position";
import { shapes } from "../../selector/root";
import { Shape } from "../../store.type";

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

export const clickedOnMiddleware: Middleware = (store) => (next) => (action: AnyAction) => {
  if (action.type === MOUSE_CLICK) {
    const storeState = store.getState();
    const mousePositionX = positionX(storeState);
    const mousePositionY = positionY(storeState);
    const allShapes = shapes(storeState);

    next(action);

    const clickedOnShape = clickedOnDetector(mousePositionX, mousePositionY, 10, 16);

    allShapes.forEach((shape) => {
      if (clickedOnShape(shape)) {
        console.log("Clicked on shape:", shape);
      }
    });
  } else {
    next(action);
  }
};
