import { Block } from "~nyte-graf-core/block";
import { OutputDataSocket } from "~nyte-graf-core/socket";

export class ConstantValueBlock<TData> extends Block {
  private value?: any;

  protected initialize(): void {
    this.addOutputDataSocket<TData>("output-socket").setOutputDataGetter(
      this.getConstantValue.bind(this)
    );
  }

  public setConstantValue(value: TData) {
    this.value = value;
  }

  public getOutputSocket(): OutputDataSocket<TData> {
    return this.getOutputDataSocket("output-socket");
  }

  private getConstantValue(): any {
    return this.value;
  }
}
