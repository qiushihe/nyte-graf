export interface IStateMachine<TState> {
  getState: () => TState;
  query: <TData>(selector: StateMachineSelector<TState, TData>) => TData;
  dispatch: (
    actions: StateMachineAction[],
    done?: (machine: IStateMachine<TState>) => void
  ) => void;
}

export type StateMachineAction<TPayload = unknown> = {
  type: string;
  payload?: TPayload;
};

export type StateMachineReducer<TState, TPayload = unknown> = {
  types: string[];
  apply: (state: TState, action: StateMachineAction<TPayload>) => TState | Promise<TState>;
};

export type StateMachineMiddleware<TState> = {
  types?: string[] | null;
  apply: (
    machine: IStateMachine<TState>,
    next: (action: StateMachineAction) => void,
    action: StateMachineAction
  ) => void;
};

export type StateMachineSelector<TState, TData> = (state: TState) => TData;
