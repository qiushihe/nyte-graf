import { Pipe } from "~src/pipe";

export interface IInputSocket {
  attachInputPipe(pipe: Pipe): void;
  onReceiveInputSignal(): void;
}

export interface IOutputSocket {
  attachOutputPipe(pipe: Pipe): void;
  onRequestOutputData(): any;
}
