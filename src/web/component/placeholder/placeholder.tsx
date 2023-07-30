import Konva from "konva";
import React, { useState } from "react";
import { Rect } from "react-konva";

type PlaceholderProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const Placeholder: React.FC<PlaceholderProps> = ({ x, y, width, height }) => {
  const [color, setColor] = useState(Konva.Util.getRandomColor());

  const handleClick = () => {
    setColor(Konva.Util.getRandomColor());
  };

  return <Rect x={x} y={y} width={width} height={height} fill={color} onClick={handleClick} />;
};
