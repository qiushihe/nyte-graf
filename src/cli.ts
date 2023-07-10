import { EntryPointBlock } from "~nyte-graf-block/core";
import { ConstantValueBlock } from "~nyte-graf-block/factory";
import { ConsoleLogBlock } from "~nyte-graf-block/log";
import { AdditionBlock } from "~nyte-graf-block/math";
import { Registry } from "~nyte-graf-block/registry";
import { DelaySignalBlock, ReplicateSignalBlock } from "~nyte-graf-block/signal";
import { Graph } from "~nyte-graf-core/graph";
import { Pipe } from "~nyte-graf-core/pipe";

const registry = Registry.getDefaultInstance();

registry.registerBlock("signal/delay", DelaySignalBlock);
registry.registerBlock("signal/replicate", ReplicateSignalBlock);
registry.registerBlock("core/entry", EntryPointBlock);
registry.registerBlock("factory/constant", ConstantValueBlock);
registry.registerBlock("math/add", AdditionBlock);
registry.registerBlock("log/console", ConsoleLogBlock);

const main = async () => {
  const constant = registry.makeBlock<ConstantValueBlock<string>>("factory/constant");
  constant.setAttribute("Value", "fortyTwo");
  const consoleLog1 = registry.makeBlock<ConsoleLogBlock>("log/console");
  Pipe.connect(
    constant.getOutputDataSocket("output-socket"),
    consoleLog1.getInputDataSocket("input-data")
  );

  const constantTen = registry.makeBlock<ConstantValueBlock<number>>("factory/constant");
  constantTen.setAttribute("Value", 10);
  const constantThirtyTwo = registry.makeBlock<ConstantValueBlock<number>>("factory/constant");
  constantThirtyTwo.setAttribute("Value", 32);
  const addition = registry.makeBlock<AdditionBlock>("math/add");
  const consoleLog2 = registry.makeBlock<ConsoleLogBlock>("log/console");
  Pipe.connect(
    constantTen.getOutputDataSocket("output-socket"),
    addition.getInputDataSocket<number>("input-a")
  );
  Pipe.connect(
    constantThirtyTwo.getOutputDataSocket("output-socket"),
    addition.getInputDataSocket<number>("input-b")
  );
  Pipe.connect(
    addition.getOutputDataSocket<number>("output-sum"),
    consoleLog2.getInputDataSocket("input-data")
  );

  const start = registry.makeBlock<EntryPointBlock>("core/entry");
  const delayer = registry.makeBlock<DelaySignalBlock>("signal/delay");
  delayer.setAttribute("Delay", 2000);
  const replicator = registry.makeBlock<ReplicateSignalBlock>("signal/replicate");
  replicator.setReplicasCount(2);
  Pipe.connect(
    start.getOutputSignalSocket("output-signal"),
    replicator.getInputSignalSocket("input-signal")
  );
  Pipe.connect(
    replicator.getOutputSignalSocket("replica-output-signal-0"),
    delayer.getInputSignalSocket("input-signal")
  );
  Pipe.connect(
    delayer.getOutputSignalSocket("output-signal"),
    consoleLog1.getInputSignalSocket("input-signal")
  );
  Pipe.connect(
    replicator.getOutputSignalSocket("replica-output-signal-1"),
    consoleLog2.getInputSignalSocket("input-signal")
  );
  start.sendSignal();

  // Use Ctl-C to quit.
  await new Promise<void>(() => setInterval(() => {}, 1000));
};

// Export an empty object ...
export {};
// ... so we can use top-level await.
await main();
