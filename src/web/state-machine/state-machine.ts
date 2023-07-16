import {
  IStateMachine,
  StateMachineAction,
  StateMachineMiddleware,
  StateMachineReducer,
  StateMachineSelector
} from "./state-machine.type";

export class StateMachine<TState> implements IStateMachine<TState> {
  private state: TState;
  private readonly reducersByType: Record<string, StateMachineReducer<TState>[]>;
  private readonly middlewaresByType: Record<string, StateMachineMiddleware<TState>[]>;
  private readonly untypedMiddlewares: StateMachineMiddleware<TState>[];

  public constructor(
    initialState: TState,
    reducers: StateMachineReducer<TState>[],
    middlewares: StateMachineMiddleware<TState>[]
  ) {
    this.state = initialState;

    this.reducersByType = reducers.reduce(
      (acc, reducer) =>
        reducer.types.reduce(
          (acc, type) => ({ ...acc, [type]: [...(acc[type] || []), reducer] }),
          acc
        ),
      {} as Record<string, StateMachineReducer<TState>[]>
    );

    this.middlewaresByType = middlewares
      .filter((middleware) => middleware.types && middleware.types.length > 0)
      .reduce(
        (acc, middleware) =>
          middleware.types.reduce(
            (acc, type) => ({ ...acc, [type]: [...(acc[type] || []), middleware] }),
            acc
          ),
        {} as Record<string, StateMachineMiddleware<TState>[]>
      );

    this.untypedMiddlewares = middlewares.filter(
      (middleware) => middleware.types === null || middleware.types === undefined
    );
  }

  public getState(): TState {
    return this.state;
  }

  public query<TData>(selector: StateMachineSelector<TState, TData>) {
    return selector(this.state);
  }

  public dispatch(actions: StateMachineAction[]) {
    this.processActions(this.state, actions, (newState) => {
      this.state = newState;
    });
  }

  private processActions(
    state: TState,
    actions: StateMachineAction[],
    done: (newState: TState) => void
  ): void {
    const [action, ...restActions] = actions;
    const reducers = this.reducersByType[action.type] || [];
    const middlewares = [
      ...(this.middlewaresByType[action.type] || []),
      ...this.untypedMiddlewares
    ];

    const processRestActions = (newState: TState) => {
      if (restActions.length > 0) {
        this.processActions(newState, restActions, done);
      } else {
        done(newState);
      }
    };

    if (reducers.length > 0) {
      this.processReducers(state, action, reducers, middlewares, processRestActions);
    } else if (middlewares.length > 0) {
      this.processMiddlewares(state, action, middlewares, () => {
        processRestActions(state);
      });
    } else {
      processRestActions(state);
    }
  }

  private processReducers(
    state: TState,
    action: StateMachineAction,
    reducers: StateMachineReducer<TState>[],
    middlewares: StateMachineMiddleware<TState>[],
    done: (newState: TState) => void
  ) {
    const [reducer, ...restReducers] = reducers;

    const applyReducer = (action: StateMachineAction) => {
      const reducerResult = reducer.apply(state, action);

      const applyRestReducers = (newState: TState): void => {
        if (restReducers.length > 0) {
          this.processReducers(newState, action, restReducers, middlewares, done);
        } else {
          done(newState);
        }
      };

      if ((reducerResult as Promise<TState>).then) {
        (reducerResult as Promise<TState>).then(applyRestReducers);
      } else {
        applyRestReducers(reducerResult as TState);
      }
    };

    if (middlewares.length > 0) {
      this.processMiddlewares(state, action, middlewares, applyReducer);
    } else {
      applyReducer(action);
    }
  }

  private processMiddlewares(
    state: TState,
    action: StateMachineAction,
    middlewares: StateMachineMiddleware<TState>[],
    done: (action: StateMachineAction) => void
  ) {
    const [middleware, ...restMiddlewares] = middlewares;

    middleware.apply(
      this,
      (action) => {
        if (restMiddlewares.length > 0) {
          this.processMiddlewares(state, action, restMiddlewares, done);
        } else {
          done(action);
        }
      },
      action
    );
  }
}
