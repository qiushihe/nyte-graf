import { Pipe } from "~src/pipe";

import { IOutputSocket } from "./socket.type";

export class OutputSignalSocket implements IOutputSocket {
  pipe?: Pipe;

  attachOutputPipe(pipe: Pipe): void {
    this.pipe = pipe;
  }

  sendSignal() {
    setTimeout(() => {
      this.pipe?.destination.onReceiveInputSignal();
    }, 1);
  }

  onRequestOutputData(): any {
    throw new Error("Unable to handle data request on signal socket");
  }
}
