import { Block } from "~nyte-graf-core/block";

export class ReplicateSignalBlock extends Block {
  protected initialize(): void {
    this.addInputSignalSocket("input-signal").setInputSignalHandler(
      this.sendReplicatedSignals.bind(this)
    );
  }

  public setReplicasCount(replicasCount: number) {
    [...Array(replicasCount).keys()].forEach((index) => {
      this.addOutputSignalSocket(`replica-output-signal-${index}`);
    });
  }

  private sendReplicatedSignals() {
    this.getOutputSignalSockets().forEach((outputSignalSocket) => {
      outputSignalSocket.sendSignal();
    });
  }
}
