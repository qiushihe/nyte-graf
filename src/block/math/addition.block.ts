import { Block } from "~nyte-graf-core/block";

export class AdditionBlock extends Block {
  protected initialize(): void {
    this.addInputDataSocket<number>("input-a");

    this.addInputDataSocket<number>("input-b");

    this.addOutputDataSocket<number>("output-sum").setOutputDataGetter(this.getSum.bind(this));
  }

  private getSum(): number {
    return (
      this.getInputDataSocket<number>("input-a").getData() +
      this.getInputDataSocket<number>("input-b").getData()
    );
  }
}
