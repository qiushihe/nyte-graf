import { Pipe } from "~src/pipe";

import { IInputSocket } from "./socket.type";

export class InputSignalSocket implements IInputSocket {
  pipe?: Pipe;
  handleInputSignal?: () => void;

  attachInputPipe(pipe: Pipe): void {
    this.pipe = pipe;
  }

  setInputSignalHandler(handleInputSignal?: () => void) {
    this.handleInputSignal = handleInputSignal;
  }

  onReceiveInputSignal(): void {
    this.handleInputSignal?.();
  }
}
