import { Block } from "~nyte-graf-core/block";
import { OutputSignalSocket } from "~nyte-graf-core/socket";

export class EntryPointBlock extends Block {
  protected initialize(): void {
    this.addOutputSignalSocket("output-signal");
  }

  public getOutputSocket(): OutputSignalSocket {
    return this.getOutputSignalSocket("output-signal");
  }

  public sendSignal() {
    this.getOutputSignalSocket("output-signal").sendSignal();
  }
}
