import { Pipe } from "~src/pipe";

import { IInputSocket } from "./socket.type";

export class InputDataSocket<TData> implements IInputSocket {
  pipe?: Pipe;

  attachInputPipe(pipe: Pipe): void {
    this.pipe = pipe;
  }

  getData(): TData {
    return this.pipe?.source.onRequestOutputData() || null;
  }

  onReceiveInputSignal(): void {
    throw new Error("Unable to handle signal on data socket");
  }
}
