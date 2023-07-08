import { Pipe } from "~nyte-graf-core/pipe";
import { IInputSocket } from "~nyte-graf-core/type";

export class InputSignalSocket implements IInputSocket {
  public pipe?: Pipe;
  public handleInputSignal?: () => void;

  public attachInputPipe(pipe: Pipe): void {
    this.pipe = pipe;
  }

  public setInputSignalHandler(handleInputSignal?: () => void) {
    this.handleInputSignal = handleInputSignal;
  }

  public onReceiveInputSignal(): void {
    this.handleInputSignal?.();
  }
}
