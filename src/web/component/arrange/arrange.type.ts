import React from "react";

export type ArrangeDirection = "horizontal" | "vertical";

export type ArrangeElementFill = {
  mode: "fill";
  render: (props: React.ComponentProps<any>) => React.JSX.Element;
};

export type ArrangeElementFitHorizontal = {
  mode: "fit";
  width: number;
  render: (props: React.ComponentProps<any>) => React.JSX.Element;
};

export type ArrangeElementFitVertical = {
  mode: "fit";
  height: number;
  render: (props: React.ComponentProps<any>) => React.JSX.Element;
};

export type ArrangeElement = {
  horizontal: ArrangeElementFill | ArrangeElementFitHorizontal;
  vertical: ArrangeElementFill | ArrangeElementFitVertical;
};

export type ArrangeProps<TDirection extends ArrangeDirection> = {
  direction: TDirection;
  x: number;
  y: number;
  width: number;
  height: number;
  children: ArrangeElement[TDirection][];
};
