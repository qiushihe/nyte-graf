import { Block } from "~nyte-graf-core/block";
import { InputSignalSocket, OutputSignalSocket } from "~nyte-graf-core/socket";

export class ReplicateSignalBlock extends Block {
  protected initialize(): void {
    this.addInputSignalSocket("input-signal").setInputSignalHandler(
      this.sendReplicatedSignals.bind(this)
    );
  }

  public setReplicasCount(replicasCount: number) {
    [...Array(replicasCount).keys()].forEach((index) => {
      this.addOutputSignalSocket(this.getReplicaSignalId(index));
    });
  }

  public getInputSocket(): InputSignalSocket {
    return this.getInputSignalSocket("input-signal");
  }

  public getOutputSocket(index: number): OutputSignalSocket {
    return this.getOutputSignalSocket(this.getReplicaSignalId(index));
  }

  private sendReplicatedSignals() {
    this.getOutputSignalSockets().forEach((outputSignalSocket) => {
      outputSignalSocket.sendSignal();
    });
  }

  private getReplicaSignalId(index: number): string {
    return `replica-output-signal-${index}`;
  }
}
