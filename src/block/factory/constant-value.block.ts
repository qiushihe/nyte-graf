import { Block } from "~nyte-graf-core/block";

export class ConstantValueBlock<TData> extends Block {
  protected initialize(): void {
    this.addAttribute("Value", "The constant value returned by this block.", 0);

    this.addOutputDataSocket<TData>("output-socket").setOutputDataGetter(
      this.getConstantValue.bind(this)
    );
  }

  private getConstantValue(): any {
    return this.getAttribute("Value");
  }
}
