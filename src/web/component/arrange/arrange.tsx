import React from "react";

import { ArrangeProps } from "./arrange.type";
import { ArrangeDirection } from "./arrange.type";
import { ArrangeElementFitHorizontal } from "./arrange.type";
import { ArrangeElementFitVertical } from "./arrange.type";

export const Arrange: React.FC<ArrangeProps<ArrangeDirection>> = (options) => {
  const fillElementsCount = options.children.filter((element) => element.mode === "fill").length;
  let fillElementSize: number;

  if (options.direction === "horizontal") {
    const totalFitWidth = options.children
      .filter((element) => element.mode === "fit")
      .map((element) => (element as ArrangeElementFitHorizontal).width)
      .reduce((acc, value) => acc + value, 0);
    fillElementSize = (options.width - totalFitWidth) / fillElementsCount;
  } else {
    const totalFitHeight = options.children
      .filter((element) => element.mode === "fit")
      .map((element) => (element as ArrangeElementFitVertical).height)
      .reduce((acc, value) => acc + value, 0);
    fillElementSize = (options.height - totalFitHeight) / fillElementsCount;
  }

  let runningSize = options.direction === "horizontal" ? options.x : options.y;

  return (
    <>
      {options.children.map((element, index) => {
        if (options.direction === "horizontal") {
          if (element.mode === "fit") {
            const elementWidth = (element as ArrangeElementFitHorizontal).width;
            const renderedElement = element.render({
              key: index,
              x: runningSize,
              y: options.y,
              width: elementWidth,
              height: options.height
            });
            runningSize = runningSize + elementWidth;
            return renderedElement;
          } else {
            const renderedElement = element.render({
              key: index,
              x: runningSize,
              y: options.y,
              width: fillElementSize,
              height: options.height
            });
            runningSize = runningSize + fillElementSize;
            return renderedElement;
          }
        } else {
          if (element.mode === "fit") {
            const elementHeight = (element as ArrangeElementFitVertical).height;
            const renderedElement = element.render({
              key: index,
              x: options.x,
              y: runningSize,
              width: options.width,
              height: elementHeight
            });
            runningSize = runningSize + elementHeight;
            return renderedElement;
          } else {
            const renderedElement = element.render({
              key: index,
              x: options.x,
              y: runningSize,
              width: options.width,
              height: fillElementSize
            });
            runningSize = runningSize + fillElementSize;
            return renderedElement;
          }
        }
      })}
    </>
  );
};
