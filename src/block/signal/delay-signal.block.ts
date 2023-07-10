import { Block } from "~nyte-graf-core/block";

export class DelaySignalBlock extends Block {
  protected initialize(): void {
    this.addAttribute(
      "Delay",
      "The amount of time (in milliseconds) to delay the input signal.",
      1
    );

    this.addInputSignalSocket("input-signal").setInputSignalHandler(
      this.sendDelayedSignal.bind(this)
    );

    this.addOutputSignalSocket("output-signal");
  }

  private sendDelayedSignal() {
    setTimeout(() => {
      this.getOutputSignalSocket("output-signal").sendSignal();
    }, this.getAttribute<number>("Delay"));
  }
}
