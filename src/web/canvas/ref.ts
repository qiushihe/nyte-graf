import { Ref, RefRegistry } from "~nyte-graf-web/canvas/canvas.type";

export const createRef = (): Ref => ({ id: null });

export const createRefRegistry = (): RefRegistry => {
  const refs: Record<string, Ref> = {};

  return {
    get: (name) => {
      if (!refs[name]) {
        refs[name] = createRef();
      }
      return refs[name];
    },
    remove: (name) => {
      delete refs[name];
    }
  };
};
