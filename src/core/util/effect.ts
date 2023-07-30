import { EffectCallback, useEffect } from "react";

export const useOnceEffect = (effect: EffectCallback) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(effect, []);
  /* eslint-enable react-hooks/exhaustive-deps */
};
