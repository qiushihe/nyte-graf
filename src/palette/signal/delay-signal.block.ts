import { Block } from "~nyte-graf-core/block";
import { InputSignalSocket, OutputSignalSocket } from "~nyte-graf-core/socket";

export class DelaySignalBlock extends Block {
  private delay: number;

  protected initialize(): void {
    this.addInputSignalSocket("input-signal").setInputSignalHandler(
      this.sendDelayedSignal.bind(this)
    );

    this.addOutputSignalSocket("output-signal");
  }

  public setDelay(delay: number) {
    this.delay = delay;
  }

  public getInputSocket(): InputSignalSocket {
    return this.getInputSignalSocket("input-signal");
  }

  public getOutputSocket(): OutputSignalSocket {
    return this.getOutputSignalSocket("output-signal");
  }

  private sendDelayedSignal() {
    setTimeout(() => {
      this.getOutputSignalSocket("output-signal").sendSignal();
    }, this.delay);
  }
}
