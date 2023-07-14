export type Layer = { id: string };

export type FillStyle = {
  fillColor?: string;
};

export type StrokeStyle = {
  strokeWidth?: number;
  strokeColor?: string;
};

export type Style = FillStyle & StrokeStyle;

export type Rectangle = FillStyle &
  StrokeStyle & { type: "rectangle"; posX: number; posY: number; width: number; height: number };

export type Circle = FillStyle &
  StrokeStyle & { type: "circle"; posX: number; posY: number; radius: number };

export type PolyLine = StrokeStyle & {
  type: "poly-line";
  points: { posX: number; posY: number }[];
};

export type Shape = Rectangle | Circle | PolyLine;

export type Ref = { id: string | null };

export type Instance<TShape extends Shape> = {
  id: string;
  layerId: string | null;
} & TShape;

export type StateShape = Instance<Rectangle> | Instance<Circle> | Instance<PolyLine>;

export type State = {
  backgroundColor: string;
  layerOrder: string[];
  layers: Layer[];
  shapes: StateShape[];
};
