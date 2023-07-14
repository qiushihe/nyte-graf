import { Polygon } from "./polygon.type";

export const circleToPolygon = (
  centerX: number,
  centerY: number,
  radius: number,
  edgesCount: number
): Polygon => {
  const theta = (Math.PI * 2) / edgesCount;
  return [...Array(edgesCount).keys()].map((_, index) => {
    const angle = index * theta;
    return [centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle)];
  });
};
