import { Block } from "~nyte-graf-core/block";
import { InputDataSocket, OutputDataSocket } from "~nyte-graf-core/socket";

export class AdditionBlock extends Block {
  protected initialize(): void {
    this.addInputDataSocket<number>("input-a");

    this.addInputDataSocket<number>("input-b");

    this.addOutputDataSocket<number>("output-sum").setOutputDataGetter(this.getSum.bind(this));
  }

  public getInputASocket(): InputDataSocket<number> {
    return this.getInputDataSocket<number>("input-a");
  }

  public getInputBSocket(): InputDataSocket<number> {
    return this.getInputDataSocket<number>("input-b");
  }

  public getOutputSumSocket(): OutputDataSocket<number> {
    return this.getOutputDataSocket<number>("output-sum");
  }

  private getSum(): number {
    return (
      this.getInputDataSocket<number>("input-a").getData() +
      this.getInputDataSocket<number>("input-b").getData()
    );
  }
}
