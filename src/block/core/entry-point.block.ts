import { Block } from "~nyte-graf-core/block";

export class EntryPointBlock extends Block {
  protected initialize(): void {
    this.addOutputSignalSocket("output-signal");
  }

  public sendSignal() {
    this.getOutputSignalSocket("output-signal").sendSignal();
  }
}
