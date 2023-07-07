import { IInputSocket, IOutputSocket } from "~src/socket";

export class Pipe {
  source: IOutputSocket;
  destination: IInputSocket;

  constructor(source: IOutputSocket, destination: IInputSocket) {
    this.source = source;
    this.destination = destination;

    this.source.attachOutputPipe(this);
    this.destination.attachInputPipe(this);
  }
}
