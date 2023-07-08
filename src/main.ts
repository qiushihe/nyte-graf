import { Pipe } from "~nyte-graf-core/pipe";
import { BlockRegistry } from "~nyte-graf-palette/block-registry";
import { EntryPointBlock } from "~nyte-graf-palette/core";
import { ConstantValueBlock } from "~nyte-graf-palette/factory";
import { ConsoleLogBlock } from "~nyte-graf-palette/log";
import { AdditionBlock } from "~nyte-graf-palette/math";
import { DelaySignalBlock, ReplicateSignalBlock } from "~nyte-graf-palette/signal";

const registry = BlockRegistry.getDefaultInstance();

registry.registerBlock("signal/delay", DelaySignalBlock);
registry.registerBlock("signal/replicate", ReplicateSignalBlock);
registry.registerBlock("core/entry", EntryPointBlock);
registry.registerBlock("factory/constant", ConstantValueBlock);
registry.registerBlock("math/add", AdditionBlock);
registry.registerBlock("log/console", ConsoleLogBlock);

const main = async () => {
  const constant = registry.makeBlock<ConstantValueBlock<string>>("factory/constant");
  constant.setConstantValue("fortyTwo");
  const consoleLog1 = registry.makeBlock<ConsoleLogBlock>("log/console");
  Pipe.connect(constant.getOutputSocket(), consoleLog1.getDataSocket());

  const constantTen = registry.makeBlock<ConstantValueBlock<number>>("factory/constant");
  constantTen.setConstantValue(10);
  const constantThirtyTwo = registry.makeBlock<ConstantValueBlock<number>>("factory/constant");
  constantThirtyTwo.setConstantValue(32);
  const addition = registry.makeBlock<AdditionBlock>("math/add");
  const consoleLog2 = registry.makeBlock<ConsoleLogBlock>("log/console");
  Pipe.connect(constantTen.getOutputSocket(), addition.getInputASocket());
  Pipe.connect(constantThirtyTwo.getOutputSocket(), addition.getInputBSocket());
  Pipe.connect(addition.getOutputSumSocket(), consoleLog2.getDataSocket());

  const start = registry.makeBlock<EntryPointBlock>("core/entry");
  const delayer = registry.makeBlock<DelaySignalBlock>("signal/delay");
  delayer.setDelay(2000);
  const replicator = registry.makeBlock<ReplicateSignalBlock>("signal/replicate");
  replicator.setReplicasCount(2);
  Pipe.connect(start.getOutputSocket(), replicator.getInputSocket());
  Pipe.connect(replicator.getOutputSocket(0), delayer.getInputSocket());
  Pipe.connect(delayer.getOutputSocket(), consoleLog1.getSignalSocket());
  Pipe.connect(replicator.getOutputSocket(1), consoleLog2.getSignalSocket());
  start.sendSignal();

  // Use Ctl-C to quit.
  await new Promise<void>(() => setInterval(() => {}, 1000));
};

// Export an empty object ...
export {};
// ... so we can use top-level await.
await main();
