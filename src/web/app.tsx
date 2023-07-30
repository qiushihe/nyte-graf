import debounce from "lodash/fp/debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Layer, Stage } from "react-konva";

import { useOnceEffect } from "~nyte-graf-core/util/effect";
import { Arrange } from "~nyte-graf-web/component/arrange";
import { BlockInstance } from "~nyte-graf-web/component/block-instance";
import { DimensionableProvider } from "~nyte-graf-web/component/dimensionable-provider";
import { useDimensionable } from "~nyte-graf-web/component/dimensionable-provider";
import { Placeholder } from "~nyte-graf-web/component/placeholder";
import { PositionableProvider } from "~nyte-graf-web/component/positionable-provider";
import { usePositionable } from "~nyte-graf-web/component/positionable-provider";
import { SelectableProvider } from "~nyte-graf-web/component/selectable-provider";
import { useSelectable } from "~nyte-graf-web/component/selectable-provider";

import { AppProps } from "./app.type";

const App: React.FC<AppProps> = ({ rootElementId }) => {
  const [stageSize, setStageSize] = useState<{ width: number; height: number } | null>(null);
  const boxIdRef = useRef("tmp-box");
  const [boxReady, setBoxReady] = useState(false);
  const { setDimension } = useDimensionable();
  const { setPosition } = usePositionable();
  const { deselectAll } = useSelectable();

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

  useOnceEffect(() => {
    setDimension(boxIdRef.current, 300, 300);
    setPosition(boxIdRef.current, 50, 300);
    setBoxReady(true);
  });

  if (!stageSize) {
    return null;
  }

  return (
    <Stage
      className="test-classname"
      width={stageSize.width}
      height={stageSize.height}
      onClick={() => deselectAll()}
    >
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
        {boxReady && <BlockInstance id={boxIdRef.current} isDraggable={true} />}
      </Layer>
    </Stage>
  );
};

type RenderAppOptions = {
  rootElementId: string;
};

const renderApp = (options: RenderAppOptions) => {
  createRoot(document.getElementById(options.rootElementId)).render(
    <SelectableProvider>
      <PositionableProvider>
        <DimensionableProvider>
          <App rootElementId={options.rootElementId} />
        </DimensionableProvider>
      </PositionableProvider>
    </SelectableProvider>
  );
};

renderApp({ rootElementId: "nyte-graf-root" });
