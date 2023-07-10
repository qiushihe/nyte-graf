import { Pipe } from "~nyte-graf-core/pipe";

export interface IInputSocket {
  attachInputPipe(pipe: Pipe): void;
  onReceiveInputSignal(): void;
}

export interface IOutputSocket {
  attachOutputPipe(pipe: Pipe): void;
  onRequestOutputData(): any;
}
