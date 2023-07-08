import { Class } from "type-fest";

import { Block } from "~nyte-graf-core/block";

export class BlockRegistry {
  private static defaultInstance: BlockRegistry;

  public static getDefaultInstance(): BlockRegistry {
    if (!BlockRegistry.defaultInstance) {
      BlockRegistry.defaultInstance = new BlockRegistry();
      return BlockRegistry.defaultInstance;
    }
  }

  private readonly blockClassById: Map<string, Class<Block>>;

  protected constructor() {
    this.blockClassById = new Map<string, Class<Block>>();
  }

  public registerBlock<TBlock extends Block>(id: string, blockClass: Class<TBlock>): void {
    if (this.blockClassById.has(id)) {
      throw new Error(`Block already registered: ${id}`);
    } else {
      this.blockClassById.set(id, blockClass);
    }
  }

  public makeBlock<TBlock extends Block = Block>(id: string): TBlock {
    if (!this.blockClassById.has(id)) {
      throw new Error(`Block not registered: ${id}`);
    } else {
      const BlockClass = this.blockClassById.get(id);
      return new BlockClass() as TBlock;
    }
  }
}
