import { Coordinate } from "~nyte-graf-web/polygon/polygon.type";

export type AddRectanglePayload = {
  id: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
};

export type AddCirclePayload = {
  id: string;
  posX: number;
  posY: number;
  radius: number;
};

export type AddPolyLinePayload = {
  id: string;
  points: Coordinate[];
};

export type FillStyle = {
  fillColor?: string;
};

export type StrokeStyle = {
  strokeWidth?: number;
  strokeColor?: string;
};

export type ShapeStyle = FillStyle & StrokeStyle;

export type UpdateShapeStylePayload = { id: string; style: ShapeStyle };

export type RemoveShapePayload = {
  id: string;
};
