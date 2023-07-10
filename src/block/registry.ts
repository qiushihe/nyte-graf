import { Class } from "type-fest";

import { Block } from "~nyte-graf-core/block";

export class Registry {
  private static defaultInstance: Registry;

  public static getDefaultInstance(): Registry {
    if (!Registry.defaultInstance) {
      Registry.defaultInstance = new Registry();
      return Registry.defaultInstance;
    }
  }

  private readonly blockClassByName: Map<string, Class<Block>>;

  protected constructor() {
    this.blockClassByName = new Map<string, Class<Block>>();
  }

  public registerBlock<TBlock extends Block>(name: string, blockClass: Class<TBlock>): void {
    if (this.blockClassByName.has(name)) {
      throw new Error(`Block already registered: ${name}`);
    } else {
      this.blockClassByName.set(name, blockClass);
    }
  }

  public makeBlock<TBlock extends Block = Block>(name: string): TBlock {
    if (!this.blockClassByName.has(name)) {
      throw new Error(`Block not registered: ${name}`);
    } else {
      const BlockClass = this.blockClassByName.get(name);
      return new BlockClass() as TBlock;
    }
  }
}
