export type ActionPreparer<TInput extends Array<any>, TPayload> = (...input: TInput) => {
  payload: TPayload;
};
