import { Block } from "~src/block";
import { Pipe } from "~src/pipe";
import {
  InputDataSocket,
  InputSignalSocket,
  OutputDataSocket,
  OutputSignalSocket
} from "~src/socket";

class SignalDelayerBlock extends Block {
  private readonly delay: number;

  constructor(delay: number) {
    super("signal-delayer");

    this.delay = delay;

    this.addInputSignalSocket("input-signal").setInputSignalHandler(
      this.sendDelayedSignal.bind(this)
    );

    this.addOutputSignalSocket("output-signal");
  }

  getInputSocket(): InputSignalSocket {
    return this.getInputSignalSocket("input-signal");
  }

  getOutputSocket(): OutputSignalSocket {
    return this.getOutputSignalSocket("output-signal");
  }

  private sendDelayedSignal() {
    setTimeout(() => {
      this.getOutputSignalSocket("output-signal").sendSignal();
    }, this.delay);
  }
}

class SignalReplicatorBlock extends Block {
  private readonly replicaCount: number;

  constructor(replicaCount: number) {
    super("signal-replicator");

    this.replicaCount = replicaCount;

    this.addInputSignalSocket("input-signal").setInputSignalHandler(
      this.sendReplicatedSignals.bind(this)
    );

    this.getReplicaIndices().forEach((index) => {
      this.addOutputSignalSocket(this.getReplicaSignalId(index));
    });
  }

  getInputSocket(): InputSignalSocket {
    return this.getInputSignalSocket("input-signal");
  }

  getOutputSocket(index: number): OutputSignalSocket {
    return this.getOutputSignalSocket(this.getReplicaSignalId(index));
  }

  private sendReplicatedSignals() {
    this.getReplicaIndices().forEach((index) => {
      this.getOutputSignalSocket(this.getReplicaSignalId(index)).sendSignal();
    });
  }

  private getReplicaIndices(): number[] {
    return [...Array(this.replicaCount).keys()];
  }

  private getReplicaSignalId(index: number): string {
    return `replica-output-signal-${index}`;
  }
}

class EntryPointBlock extends Block {
  constructor() {
    super("entry-point");
    this.addOutputSignalSocket("output-signal");
  }

  getOutputSocket(): OutputSignalSocket {
    return this.getOutputSignalSocket("output-signal");
  }

  start() {
    this.getOutputSignalSocket("output-signal").sendSignal();
  }
}

class ConstantBlock<TData> extends Block {
  value?: any;

  constructor(value?: any) {
    super("constant");

    this.value = value;

    this.addOutputDataSocket<TData>("output-socket").setOutputDataGetter(
      this.getConstantValue.bind(this)
    );
  }

  getOutputSocket(): OutputDataSocket<TData> {
    return this.getOutputDataSocket("output-socket");
  }

  private getConstantValue(): any {
    return this.value;
  }
}

class AdditionBlock extends Block {
  constructor() {
    super("addition");

    this.addInputDataSocket<number>("input-a");

    this.addInputDataSocket<number>("input-b");

    this.addOutputDataSocket<number>("output-sum").setOutputDataGetter(this.getSum.bind(this));
  }

  getInputASocket(): InputDataSocket<number> {
    return this.getInputDataSocket<number>("input-a");
  }

  getInputBSocket(): InputDataSocket<number> {
    return this.getInputDataSocket<number>("input-b");
  }

  getOutputSumSocket(): OutputDataSocket<number> {
    return this.getOutputDataSocket<number>("output-sum");
  }

  private getSum(): number {
    return (
      this.getInputDataSocket<number>("input-a").getData() +
      this.getInputDataSocket<number>("input-b").getData()
    );
  }
}

class ConsoleLogBlock extends Block {
  constructor() {
    super("console-log");

    this.addInputSignalSocket("input-signal").setInputSignalHandler(
      this.logDataToConsole.bind(this)
    );

    this.addInputDataSocket("input-data");
  }

  getSignalSocket(): InputSignalSocket {
    return this.getInputSignalSocket("input-signal");
  }

  getDataSocket(): InputDataSocket<any> {
    return this.getInputDataSocket("input-data");
  }

  private logDataToConsole() {
    console.log(`[ConsoleLogBlock]`, this.getInputDataSocket<any>("input-data").getData());
  }
}

const main = async () => {
  const constant = new ConstantBlock("fortyTwo");
  const consoleLog1 = new ConsoleLogBlock();
  new Pipe(constant.getOutputSocket(), consoleLog1.getDataSocket());

  const constantTen = new ConstantBlock(10);
  const constantThirtyTwo = new ConstantBlock(32);
  const addition = new AdditionBlock();
  const consoleLog2 = new ConsoleLogBlock();
  new Pipe(constantTen.getOutputSocket(), addition.getInputASocket());
  new Pipe(constantThirtyTwo.getOutputSocket(), addition.getInputBSocket());
  new Pipe(addition.getOutputSumSocket(), consoleLog2.getDataSocket());

  const entry = new EntryPointBlock();
  const delayer = new SignalDelayerBlock(2000);
  const replicator = new SignalReplicatorBlock(2);
  new Pipe(entry.getOutputSocket(), replicator.getInputSocket());
  new Pipe(replicator.getOutputSocket(0), delayer.getInputSocket());
  new Pipe(delayer.getOutputSocket(), consoleLog1.getSignalSocket());
  new Pipe(replicator.getOutputSocket(1), consoleLog2.getSignalSocket());
  entry.start();

  // Use Ctl-C to quit.
  await new Promise<void>(() => {
    setInterval(() => {}, 1000);
  });
};

// Export an empty object ...
export {};
// ... so we can use top-level await.
await main();
