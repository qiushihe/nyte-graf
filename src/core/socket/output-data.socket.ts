import { Pipe } from "~nyte-graf-core/pipe";
import { IOutputSocket } from "~nyte-graf-core/type";

export class OutputDataSocket<TData> implements IOutputSocket {
  public pipe?: Pipe;
  public getOutputData?: () => TData;

  public attachOutputPipe(pipe: Pipe): void {
    this.pipe = pipe;
  }

  public setOutputDataGetter(getOutputData: () => TData) {
    this.getOutputData = getOutputData;
  }

  public onRequestOutputData(): TData {
    return this.getOutputData?.() || null;
  }
}
