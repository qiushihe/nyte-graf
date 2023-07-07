import { Pipe } from "~src/pipe";

import { IOutputSocket } from "./socket.type";

export class OutputDataSocket<TData> implements IOutputSocket {
  pipe?: Pipe;
  getOutputData?: () => TData;

  attachOutputPipe(pipe: Pipe): void {
    this.pipe = pipe;
  }

  setOutputDataGetter(getOutputData: () => TData) {
    this.getOutputData = getOutputData;
  }

  onRequestOutputData(): TData {
    return this.getOutputData?.() || null;
  }
}
