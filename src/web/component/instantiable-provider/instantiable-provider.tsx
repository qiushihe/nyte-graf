import omit from "lodash/fp/omit";
import React, { useCallback, useState } from "react";

import { instantiableContext } from "./instantiable-provider.context";
import { AddInstance } from "./instantiable-provider.context";
import { RemoveInstance } from "./instantiable-provider.context";
import { GetInstanceTypes } from "./instantiable-provider.context";
import { GetInstanceIds } from "./instantiable-provider.context";
import { InstantiableProviderProps } from "./instantiable-provider.type";

export const InstantiableProvider: React.FC<InstantiableProviderProps> = ({ children }) => {
  const [idsByType, setIdsByType] = useState<Record<string, Record<string, string>>>({});

  const handleAddInstance = useCallback<AddInstance>(
    (type, id) => {
      setIdsByType({ ...idsByType, [type]: { ...(idsByType[type] || {}), [id]: id } });
    },
    [idsByType]
  );

  const handleRemoveInstance = useCallback<RemoveInstance>(
    (type, id) => {
      setIdsByType({ ...idsByType, [type]: omit([id])({ ...(idsByType[type] || {}) }) });
    },
    [idsByType]
  );

  const handleGetInstanceTypes = useCallback<GetInstanceTypes>(() => {
    return Object.keys(idsByType);
  }, [idsByType]);

  const handleGetInstanceIds = useCallback<GetInstanceIds>(
    (type) => {
      return Object.keys(idsByType[type] || {});
    },
    [idsByType]
  );

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
