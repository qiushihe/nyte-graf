import flow from "lodash/fp/flow";
import flowRight from "lodash/fp/flowRight";
import map from "lodash/fp/map";
import React from "react";

export const withContainer =
  (Container: React.FC<any>, props?: Record<string, any>) => (children: React.ReactNode) =>
    <Container {...(props || {})}>{children}</Container>;

export const withContainers = (providers: ([React.FC] | [React.FC, Record<string, any>])[]) =>
  flow([map(([Provider, props]) => withContainer(Provider, props)), flowRight])(providers) as (
    children: React.ReactNode
  ) => React.ReactNode;
