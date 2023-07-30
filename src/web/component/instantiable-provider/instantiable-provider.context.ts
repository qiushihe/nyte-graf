import { createContext, useContext } from "react";

export type AddInstance = (type: string, id: string) => void;

export type RemoveInstance = (type: string, id: string) => void;

export type GetInstanceTypes = () => string[];

export type GetInstanceIds = (type: string) => string[];

export type InstantiableContext = {
  addInstance: AddInstance;
  removeInstance: RemoveInstance;
  getInstanceTypes: GetInstanceTypes;
  getInstanceIds: GetInstanceIds;
};

export const instantiableContext = createContext<InstantiableContext>({
  addInstance: () => {},
  removeInstance: () => {},
  getInstanceTypes: () => [],
  getInstanceIds: () => []
});

export const useInstantiable = (): InstantiableContext => {
  return useContext(instantiableContext);
};
