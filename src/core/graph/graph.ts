import { Registry } from "~nyte-graf-block/registry";
import { Block } from "~nyte-graf-core/block";
import { BlockAttributeValue } from "~nyte-graf-core/block/block.type";
import { IDefaultSignalSender } from "~nyte-graf-core/interface";
import { Pipe } from "~nyte-graf-core/pipe";
import { tap } from "~nyte-graf-core/util/fp";
import { uuidV4 } from "~nyte-graf-core/util/uuid-v4";

import { BlockInstance, PipeInstance } from "./graph.type";

export class Graph {
  private readonly blockRegistry: Registry;
  private readonly blockInstances: BlockInstance[];
  private readonly pipeInstances: PipeInstance[];
  private entryBlockInstanceId: string | null;

  public constructor(registry: Registry) {
    this.blockRegistry = registry;
    this.blockInstances = [];
    this.pipeInstances = [];
    this.entryBlockInstanceId = null;
  }

  public addBlock(name: string, attributes?: Record<string, BlockAttributeValue>): string {
    const block = this.blockRegistry.makeBlock(name);

    Object.entries(attributes || {}).forEach(([key, value]) => {
      block.setAttribute(key, value);
    });

    return tap<string>((instanceId) => {
      this.blockInstances.push({ id: instanceId, name, block });
    })(uuidV4());
  }

  public getBlock<TBlock extends Block>(instanceId: string): TBlock {
    const blockInstance =
      this.blockInstances.find((instance) => instance.id === instanceId) || null;
    if (!blockInstance) {
      throw new Error(`Block instance not found: ${instanceId}`);
    }

    return blockInstance.block as TBlock;
  }

  public setEntryBlockInstanceId(id: string) {
    this.entryBlockInstanceId = id;
  }

  public sendEntrySignal() {
    if (this.entryBlockInstanceId) {
      const entryBlockInstance = this.getBlock(this.entryBlockInstanceId);
      if (!entryBlockInstance) {
        throw new Error(`Entry block instance not found: ${this.entryBlockInstanceId}`);
      }

      (entryBlockInstance as any as IDefaultSignalSender).sendDefaultSignal();
    } else {
      throw new Error("Missing entry block instance ID");
    }
  }

  public addSignalConnection(
    fromInstanceId: string,
    fromSocketId: string,
    toInstanceId: string,
    toSocketId: string
  ): string {
    return this.addConnection("signal", fromInstanceId, fromSocketId, toInstanceId, toSocketId);
  }

  public addDataConnection(
    fromInstanceId: string,
    fromSocketId: string,
    toInstanceId: string,
    toSocketId: string
  ): string {
    return this.addConnection("data", fromInstanceId, fromSocketId, toInstanceId, toSocketId);
  }

  private addConnection(
    transport: "signal" | "data",
    fromInstanceId: string,
    fromSocketId: string,
    toInstanceId: string,
    toSocketId: string
  ): string {
    const fromBlockInstance =
      this.blockInstances.find((instance) => instance.id === fromInstanceId) || null;
    if (!fromBlockInstance) {
      throw new Error(`Block instance (from) not found: ${fromInstanceId}`);
    }

    const toBlockInstance =
      this.blockInstances.find((instance) => instance.id === toInstanceId) || null;
    if (!toBlockInstance) {
      throw new Error(`Block instance (to) not found: ${toInstanceId}`);
    }

    let pipe: Pipe;
    if (transport === "signal") {
      pipe = Pipe.connect(
        fromBlockInstance.block.getOutputSignalSocket(fromSocketId),
        toBlockInstance.block.getInputSignalSocket(toSocketId)
      );
    } else if (transport === "data") {
      pipe = Pipe.connect(
        fromBlockInstance.block.getOutputDataSocket(fromSocketId),
        toBlockInstance.block.getInputDataSocket(toSocketId)
      );
    } else {
      throw new Error(`Unknown transport: ${transport}`);
    }

    return tap<string>((instanceId) => {
      this.pipeInstances.push({
        id: instanceId,
        transport,
        fromInstanceId,
        fromSocketId,
        toInstanceId,
        toSocketId,
        pipe
      });
    })(uuidV4());
  }

  public serialize(): string {
    return JSON.stringify(
      {
        entryBlockInstanceId: this.entryBlockInstanceId,
        blocks: this.blockInstances.map((instance) => ({
          id: instance.id,
          name: instance.name,
          attributes: instance.block.getAttributes()
        })),
        connections: this.pipeInstances.map((instance) => ({
          id: instance.id,
          transport: instance.transport,
          fromInstanceId: instance.fromInstanceId,
          fromSocketId: instance.fromSocketId,
          toInstanceId: instance.toInstanceId,
          toSocketId: instance.toSocketId
        }))
      },
      null,
      2
    );
  }

  public deserialize(serialized: string) {
    const json = JSON.parse(serialized);

    this.entryBlockInstanceId = json.entryBlockInstanceId;

    (json.blocks || []).forEach((data) => {
      const block = this.blockRegistry.makeBlock(data.name);

      Object.entries(data.attributes || {}).forEach(([key, value]) => {
        block.setAttribute(key, value as any);
      });

      this.blockInstances.push({ id: data.id, name: data.name, block });
    });

    (json.connections || []).forEach((data) => {
      const fromBlockInstance =
        this.blockInstances.find((instance) => instance.id === data.fromInstanceId) || null;
      if (!fromBlockInstance) {
        throw new Error(`Block instance (from) not found: ${data.fromInstanceId}`);
      }

      const toBlockInstance =
        this.blockInstances.find((instance) => instance.id === data.toInstanceId) || null;
      if (!toBlockInstance) {
        throw new Error(`Block instance (to) not found: ${data.toInstanceId}`);
      }

      let pipe: Pipe;
      if (data.transport === "signal") {
        pipe = Pipe.connect(
          fromBlockInstance.block.getOutputSignalSocket(data.fromSocketId),
          toBlockInstance.block.getInputSignalSocket(data.toSocketId)
        );
      } else if (data.transport === "data") {
        pipe = Pipe.connect(
          fromBlockInstance.block.getOutputDataSocket(data.fromSocketId),
          toBlockInstance.block.getInputDataSocket(data.toSocketId)
        );
      } else {
        throw new Error(`Unknown transport: ${data.transport}`);
      }

      this.pipeInstances.push({
        id: data.id,
        transport: data.transport,
        fromInstanceId: data.fromInstanceId,
        fromSocketId: data.fromSocketId,
        toInstanceId: data.toInstanceId,
        toSocketId: data.toSocketId,
        pipe
      });
    });
  }
}
