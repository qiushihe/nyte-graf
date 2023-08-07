import omit from "lodash/fp/omit";
import React, { useState } from "react";

import { instantiableContext } from "./instantiable-provider.context";
import { AddInstance } from "./instantiable-provider.context";
import { RemoveInstance } from "./instantiable-provider.context";
import { GetInstanceTypes } from "./instantiable-provider.context";
import { GetInstanceIds } from "./instantiable-provider.context";
import { InstantiableProviderProps } from "./instantiable-provider.type";

export const InstantiableProvider: React.FC<InstantiableProviderProps> = ({ children }) => {
  const [idsByType, setIdsByType] = useState<Record<string, Record<string, string>>>({});

  const handleAddInstance: AddInstance = (type, id) => {
    setIdsByType((state) => {
      return { ...state, [type]: { ...(state[type] || {}), [id]: id } };
    });
  };

  const handleRemoveInstance: RemoveInstance = (type, id) => {
    setIdsByType((state) => {
      return { ...state, [type]: omit([id])({ ...(state[type] || {}) }) };
    });
  };

  const handleGetInstanceTypes: GetInstanceTypes = () => {
    return Object.keys(idsByType);
  };

  const handleGetInstanceIds: GetInstanceIds = (type) => {
    return Object.keys(idsByType[type] || {});
  };

  const providerValue = {
    addInstance: handleAddInstance,
    removeInstance: handleRemoveInstance,
    getInstanceTypes: handleGetInstanceTypes,
    getInstanceIds: handleGetInstanceIds
  } as const;

  return (
    <instantiableContext.Provider value={providerValue}>{children}</instantiableContext.Provider>
  );
};
