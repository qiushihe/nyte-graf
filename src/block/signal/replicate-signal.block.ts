import { Block } from "~nyte-graf-core/block";

export class ReplicateSignalBlock extends Block {
  protected initialize(): void {
    this.addAttribute("Count", "The number of times the input signal is replicated.", 2);

    this.addInputSignalSocket("input-signal").setInputSignalHandler(
      this.sendReplicatedSignals.bind(this)
    );
  }

  public setAttribute(name: string, value: unknown) {
    super.setAttribute(name, value as any);

    if (name === "Count") {
      // TODO: Add/Remove output sockets when changing the "Count" value
      // TODO: Disconnect already connected pipes when removing output sockets

      [...Array(value as number).keys()].forEach((index) => {
        this.addOutputSignalSocket(`replica-output-signal-${index}`);
      });
    }
  }

  private sendReplicatedSignals() {
    this.getOutputSignalSockets().forEach((outputSignalSocket) => {
      outputSignalSocket.sendSignal();
    });
  }
}
