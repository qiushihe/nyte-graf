import { Block } from "~nyte-graf-core/block";
import { InputDataSocket, InputSignalSocket } from "~nyte-graf-core/socket";

export class ConsoleLogBlock extends Block {
  protected initialize(): void {
    this.addInputSignalSocket("input-signal").setInputSignalHandler(
      this.logDataToConsole.bind(this)
    );

    this.addInputDataSocket("input-data");
  }

  public getSignalSocket(): InputSignalSocket {
    return this.getInputSignalSocket("input-signal");
  }

  public getDataSocket(): InputDataSocket<any> {
    return this.getInputDataSocket("input-data");
  }

  private logDataToConsole() {
    console.log(`[ConsoleLogBlock]`, this.getInputDataSocket<any>("input-data").getData());
  }
}
