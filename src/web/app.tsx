import debounce from "lodash/fp/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Layer, Stage } from "react-konva";

import { Arrange } from "~nyte-graf-web/component/arrange";
import { Block } from "~nyte-graf-web/component/block";
import { DraggableController } from "~nyte-graf-web/component/draggable-controller";
import { Placeholder } from "~nyte-graf-web/component/placeholder";

import { AppProps } from "./app.type";

const App: React.FC<AppProps> = ({ rootElementId }) => {
  const [stageSize, setStageSize] = useState<{ width: number; height: number } | null>(null);

  const handleWindowResize = useCallback(() => {
    const rootElement = document.getElementById(rootElementId);

    setStageSize({
      width: rootElement.clientWidth,
      height: rootElement.clientHeight
    });
  }, [rootElementId]);

  useEffect(() => {
    window.addEventListener("resize", debounce(100)(handleWindowResize));
    handleWindowResize();
  }, [handleWindowResize]);

  if (!stageSize) {
    return null;
  }

  return (
    <Stage className="test-classname" width={stageSize.width} height={stageSize.height}>
      <Layer>
        <Arrange direction="vertical" x={0} y={0} width={stageSize.width} height={100}>
          {[
            {
              mode: "fit",
              height: 30,
              render: (props) => <Placeholder {...props} />
            },
            {
              mode: "fill",
              render: (props) => <Placeholder {...props} />
            },
            {
              mode: "fit",
              height: 20,
              render: (props) => <Placeholder {...props} />
            }
          ]}
        </Arrange>
        <Arrange direction="horizontal" x={0} y={100} width={stageSize.width} height={100}>
          {[
            {
              mode: "fit",
              width: 30,
              render: (props) => <Placeholder {...props} />
            },
            {
              mode: "fill",
              render: (props) => <Placeholder {...props} />
            },
            {
              mode: "fit",
              width: 20,
              render: (props) => <Placeholder {...props} />
            }
          ]}
        </Arrange>
        <DraggableController initialX={0} initialY={300}>
          {({ x, y, isDragging, onDragStart, onDragEnd }) => (
            <Block
              x={x}
              y={y}
              isDraggable={true}
              isDragging={isDragging}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          )}
        </DraggableController>
      </Layer>
    </Stage>
  );
};

type RenderAppOptions = {
  rootElementId: string;
};

const renderApp = (options: RenderAppOptions) => {
  createRoot(document.getElementById(options.rootElementId)).render(
    <App rootElementId={options.rootElementId} />
  );
};

renderApp({ rootElementId: "nyte-graf-root" });
