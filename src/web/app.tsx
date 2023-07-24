import debounce from "lodash/fp/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Group, Layer, Stage, Text } from "react-konva";

import { Arrange } from "~nyte-graf-web/component/arrange";
import { Placeholder } from "~nyte-graf-web/component/placeholder";

type AppProps = {
  rootElementId: string;
};

const App: React.FC<AppProps> = ({ rootElementId }) => {
  const [stageSize, setStageSize] = useState<{ width: number; height: number } | null>(null);
  const [dndState, setDnDState] = useState<{ isDragging: boolean; x: number; y: number }>({
    isDragging: false,
    x: 0,
    y: 300
  });

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
        <Group
          draggable
          x={dndState.x}
          y={dndState.y}
          onDragStart={() => {
            setDnDState({
              ...dndState,
              isDragging: true
            });
          }}
          onDragEnd={(evt) => {
            setDnDState({
              ...dndState,
              isDragging: false,
              x: evt.target.x(),
              y: evt.target.y()
            });
          }}
        >
          <Text x={0} y={50} text="Draggable Text" fill={dndState.isDragging ? "green" : "black"} />
          <Text
            x={0}
            y={100}
            text="Some other text in the same group"
            fill={dndState.isDragging ? "black" : "green"}
          />
        </Group>
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
