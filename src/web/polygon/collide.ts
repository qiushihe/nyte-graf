import * as geometric from "geometric";

import { Coordinate, Line, Polygon } from "./polygon.type";

export const polygonCollideWithPolygon = (polygonA: Polygon, polygonB: Polygon): boolean => {
  return (
    geometric.polygonInPolygon(polygonA, polygonB) ||
    geometric.polygonInPolygon(polygonB, polygonA) ||
    geometric.polygonIntersectsPolygon(polygonA, polygonB)
  );
};

export const polygonCollideWithPolyLine = (
  polygon: Polygon,
  coordinates: Coordinate[]
): boolean => {
  const segments: Line[] = [];
  for (let pointIndex = 0; pointIndex < coordinates.length - 1; pointIndex++) {
    segments.push([coordinates[pointIndex], coordinates[pointIndex + 1]]);
  }
  return !!segments.find((line) => geometric.lineIntersectsPolygon(line, polygon));
};
