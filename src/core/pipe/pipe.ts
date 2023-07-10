import { IInputSocket, IOutputSocket } from "~nyte-graf-core/socket";

export class Pipe {
  public static connect(source: IOutputSocket, destination: IInputSocket): Pipe {
    return new Pipe(source, destination);
  }

  public source: IOutputSocket;
  public destination: IInputSocket;

  protected constructor(source: IOutputSocket, destination: IInputSocket) {
    this.source = source;
    this.destination = destination;

    this.source.attachOutputPipe(this);
    this.destination.attachInputPipe(this);
  }
}
