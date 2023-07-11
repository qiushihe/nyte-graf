import { EntryPointBlock } from "~nyte-graf-block/core";
import { ConstantValueBlock } from "~nyte-graf-block/factory";
import { ConsoleLogBlock } from "~nyte-graf-block/log";
import { AdditionBlock } from "~nyte-graf-block/math";
import { Registry } from "~nyte-graf-block/registry";
import { DelaySignalBlock, ReplicateSignalBlock } from "~nyte-graf-block/signal";
import { Graph } from "~nyte-graf-core/graph";

const registry = Registry.getDefaultInstance();

registry.registerBlock("signal/delay", DelaySignalBlock);
registry.registerBlock("signal/replicate", ReplicateSignalBlock);
registry.registerBlock("core/entry", EntryPointBlock);
registry.registerBlock("factory/constant", ConstantValueBlock);
registry.registerBlock("math/add", AdditionBlock);
registry.registerBlock("log/console", ConsoleLogBlock);

const main = async () => {
  const graph = new Graph(registry);

  const constant1Id = graph.createBlock("factory/constant", { Value: "fortyTwo" });
  const log1Id = graph.createBlock("log/console");
  graph.createDataConnection(constant1Id, "output-socket", log1Id, "input-data");

  const constant2Id = graph.createBlock("factory/constant", { Value: 10 });
  const constant3Id = graph.createBlock("factory/constant", { Value: 32 });
  const additionId = graph.createBlock("math/add");
  const log2Id = graph.createBlock("log/console");
  graph.createDataConnection(constant2Id, "output-socket", additionId, "input-a");
  graph.createDataConnection(constant3Id, "output-socket", additionId, "input-b");
  graph.createDataConnection(additionId, "output-sum", log2Id, "input-data");

  const startId = graph.createBlock("core/entry");
  graph.setEntryBlockInstanceId(startId);

  const replicateId = graph.createBlock("signal/replicate", { Count: 2 });
  const delayId = graph.createBlock("signal/delay", { Delay: 2000 });
  graph.createSignalConnection(startId, "output-signal", replicateId, "input-signal");
  graph.createSignalConnection(replicateId, "replica-output-signal-0", log1Id, "input-signal");
  graph.createSignalConnection(replicateId, "replica-output-signal-1", delayId, "input-signal");
  graph.createSignalConnection(delayId, "output-signal", log2Id, "input-signal");

  const serialized = graph.serialize();
  console.log("=========");
  console.log(serialized);
  console.log("=========");

  const deserializedGraph = new Graph(registry);
  deserializedGraph.deserialize(serialized);
  deserializedGraph.sendEntrySignal();

  // Use Ctl-C to quit.
  await new Promise<void>(() => setInterval(() => {}, 1000));
};

// Export an empty object ...
export {};
// ... so we can use top-level await.
await main();
