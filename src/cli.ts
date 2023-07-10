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

  const constant1Id = graph.addBlock("factory/constant", { Value: "fortyTwo" });
  const consoleLog1Id = graph.addBlock("log/console");
  graph.addDataConnection(constant1Id, "output-socket", consoleLog1Id, "input-data");

  const constant2Id = graph.addBlock("factory/constant", { Value: 10 });
  const constant3Id = graph.addBlock("factory/constant", { Value: 32 });
  const additionId = graph.addBlock("math/add");
  const consoleLog2Id = graph.addBlock("log/console");
  graph.addDataConnection(constant2Id, "output-socket", additionId, "input-a");
  graph.addDataConnection(constant3Id, "output-socket", additionId, "input-b");
  graph.addDataConnection(additionId, "output-sum", consoleLog2Id, "input-data");

  const startId = graph.addBlock("core/entry");
  graph.setEntryBlockInstanceId(startId);

  const replicateId = graph.addBlock("signal/replicate", { Count: 2 });
  const delayId = graph.addBlock("signal/delay", { Delay: 2000 });
  graph.addSignalConnection(startId, "output-signal", replicateId, "input-signal");
  graph.addSignalConnection(replicateId, "replica-output-signal-0", consoleLog1Id, "input-signal");
  graph.addSignalConnection(replicateId, "replica-output-signal-1", delayId, "input-signal");
  graph.addSignalConnection(delayId, "output-signal", consoleLog2Id, "input-signal");

  const serializedGraph = graph.serialize();
  console.log("=========");
  console.log(serializedGraph);
  console.log("=========");

  const deserializedGraph = new Graph(registry);
  deserializedGraph.deserialize(serializedGraph);
  deserializedGraph.sendEntrySignal();

  // Use Ctl-C to quit.
  await new Promise<void>(() => setInterval(() => {}, 1000));
};

// Export an empty object ...
export {};
// ... so we can use top-level await.
await main();
