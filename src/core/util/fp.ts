export const tap =
  <TValue>(interceptor: (value: TValue) => void) =>
  (value: TValue): TValue => {
    interceptor(value);
    return value;
  };
