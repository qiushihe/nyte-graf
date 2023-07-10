import { Block } from "~nyte-graf-core/block";

export class ConsoleLogBlock extends Block {
  protected initialize(): void {
    this.addInputSignalSocket("input-signal").setInputSignalHandler(
      this.logDataToConsole.bind(this)
    );

    this.addInputDataSocket("input-data");
  }

  private logDataToConsole() {
    console.log(`[ConsoleLogBlock]`, this.getInputDataSocket<any>("input-data").getData());
  }
}
