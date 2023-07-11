import { Registry } from "~nyte-graf-block/registry";
import { Block } from "~nyte-graf-core/block";
import { BlockAttributeValue } from "~nyte-graf-core/block/block.type";
import { IDefaultSignalSender } from "~nyte-graf-core/interface";
import { Pipe } from "~nyte-graf-core/pipe";
import { tap } from "~nyte-graf-core/util/fp";
import { uuidV4 } from "~nyte-graf-core/util/uuid-v4";

import { BlockInstance, PipeInstance, SerializedGraph } from "./graph.type";

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

  public createBlock(name: string, attributes?: Record<string, BlockAttributeValue>): string {
    return tap<string>((instanceId) => this.addBlock(instanceId, name, attributes))(uuidV4());
  }

  private addBlock(id: string, name: string, attributes?: Record<string, unknown>) {
    const block = this.blockRegistry.makeBlock(name);

    Object.entries(attributes || {}).forEach(([key, value]) => {
      block.setAttribute(key, value as BlockAttributeValue);
    });

    this.blockInstances.push({ id, name, block });
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

  public createSignalConnection(
    fromInstanceId: string,
    fromSocketId: string,
    toInstanceId: string,
    toSocketId: string
  ): string {
    return tap<string>((uuid) =>
      this.addConnection(uuid, "signal", fromInstanceId, fromSocketId, toInstanceId, toSocketId)
    )(uuidV4());
  }

  public createDataConnection(
    fromInstanceId: string,
    fromSocketId: string,
    toInstanceId: string,
    toSocketId: string
  ): string {
    return tap<string>((uuid) =>
      this.addConnection(uuid, "data", fromInstanceId, fromSocketId, toInstanceId, toSocketId)
    )(uuidV4());
  }

  private addConnection(
    id: string,
    transport: string,
    fromInstanceId: string,
    fromSocketId: string,
    toInstanceId: string,
    toSocketId: string
  ) {
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

    this.pipeInstances.push({
      id,
      transport,
      fromInstanceId,
      fromSocketId,
      toInstanceId,
      toSocketId,
      pipe
    });
  }

  public serialize(): string {
    const serializedGraph: SerializedGraph = {
      entryBlockInstanceId: this.entryBlockInstanceId || null,
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
    };

    return JSON.stringify(serializedGraph, null, 2);
  }

  public deserialize(serialized: string) {
    const serializedGraph = JSON.parse(serialized) as SerializedGraph;

    this.entryBlockInstanceId = serializedGraph.entryBlockInstanceId || null;

    (serializedGraph.blocks || []).forEach((data) => {
      this.addBlock(data.id, data.name, data.attributes);
    });

    (serializedGraph.connections || []).forEach((data) => {
      this.addConnection(
        data.id,
        data.transport,
        data.fromInstanceId,
        data.fromSocketId,
        data.toInstanceId,
        data.toSocketId
      );
    });
  }
}
