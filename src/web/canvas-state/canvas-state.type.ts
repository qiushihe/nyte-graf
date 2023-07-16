export type FillStyle = {
  fillColor?: string;
};

export type StrokeStyle = {
  strokeWidth?: number;
  strokeColor?: string;
};

export type ShapeStyle = FillStyle & StrokeStyle;

export type Layer = { id: string; name: string };

export type Rectangle = FillStyle &
  StrokeStyle & { type: "rectangle"; posX: number; posY: number; width: number; height: number };

export type Circle = FillStyle &
  StrokeStyle & { type: "circle"; posX: number; posY: number; radius: number };

export type PolyLine = StrokeStyle & {
  type: "poly-line";
  points: { posX: number; posY: number }[];
};

export type Shape = Rectangle | Circle | PolyLine;

export type ShapeInstance<TShape extends Shape> = {
  id: string;
  layerId: string | null;
} & TShape;

export type StateShape = ShapeInstance<Rectangle> | ShapeInstance<Circle> | ShapeInstance<PolyLine>;

export type CanvasState = {
  mousePosition: { x: number; y: number };
  backgroundColor: string;
  layerOrder: string[];
  layers: Layer[];
  shapes: StateShape[];
};