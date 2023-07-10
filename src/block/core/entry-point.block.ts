import { Block } from "~nyte-graf-core/block";
import { IDefaultSignalSender } from "~nyte-graf-core/interface";

export class EntryPointBlock extends Block implements IDefaultSignalSender {
  protected initialize(): void {
    this.addOutputSignalSocket("output-signal");
  }

  public sendDefaultSignal() {
    this.getOutputSignalSocket("output-signal").sendSignal();
  }
}
