import { Pipe } from "~nyte-graf-core/pipe";
import { IOutputSocket } from "~nyte-graf-core/type";

export class OutputSignalSocket implements IOutputSocket {
  public pipe?: Pipe;

  public attachOutputPipe(pipe: Pipe): void {
    this.pipe = pipe;
  }

  public sendSignal() {
    setTimeout(() => {
      this.pipe?.destination.onReceiveInputSignal();
    }, 1);
  }

  public onRequestOutputData(): any {
    throw new Error("Unable to handle data request on signal socket");
  }
}
