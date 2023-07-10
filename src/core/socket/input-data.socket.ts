import { Pipe } from "~nyte-graf-core/pipe";
import { IInputSocket } from "~nyte-graf-core/socket";

export class InputDataSocket<TData> implements IInputSocket {
  public pipe?: Pipe;

  public attachInputPipe(pipe: Pipe): void {
    this.pipe = pipe;
  }

  public getData(): TData {
    return this.pipe?.source.onRequestOutputData() || null;
  }

  public onReceiveInputSignal(): void {
    throw new Error("Unable to handle signal on data socket");
  }
}
