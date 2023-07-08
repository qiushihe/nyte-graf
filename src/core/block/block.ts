import {
  InputDataSocket,
  InputSignalSocket,
  OutputDataSocket,
  OutputSignalSocket
} from "~nyte-graf-core/socket";
import { IInputSocket, IOutputSocket } from "~nyte-graf-core/type";

export abstract class Block {
  private readonly inputSignalSockets: Record<string, IInputSocket>;
  private readonly outputSignalSockets: Record<string, IOutputSocket>;
  private readonly inputDataSockets: Record<string, IInputSocket>;
  private readonly outputDataSockets: Record<string, IOutputSocket>;

  public constructor() {
    this.inputSignalSockets = {};
    this.outputSignalSockets = {};
    this.inputDataSockets = {};
    this.outputDataSockets = {};
    this.initialize();
  }

  protected initialize(): void {}

  protected addInputSignalSocket(id: string): InputSignalSocket {
    if (this.inputSignalSockets[id]) {
      throw new Error(`Input signal socket "${id}" already exist`);
    } else {
      this.inputSignalSockets[id] = new InputSignalSocket();
      return this.getInputSignalSocket(id);
    }
  }

  protected getInputSignalSocket(id: string): InputSignalSocket {
    if (!this.inputSignalSockets[id]) {
      throw new Error(`Input signal socket "${id}" does not exist`);
    } else {
      return this.inputSignalSockets[id] as InputSignalSocket;
    }
  }

  protected getInputSignalSockets(): InputSignalSocket[] {
    return Object.values(this.inputSignalSockets) as InputSignalSocket[];
  }

  protected addOutputSignalSocket(id: string): OutputSignalSocket {
    if (this.outputSignalSockets[id]) {
      throw new Error(`Output signal socket "${id}" already exist`);
    } else {
      this.outputSignalSockets[id] = new OutputSignalSocket();
      return this.getOutputSignalSocket(id);
    }
  }

  protected getOutputSignalSocket(id: string): OutputSignalSocket {
    if (!this.outputSignalSockets[id]) {
      throw new Error(`Output signal socket "${id}" does not exist`);
    } else {
      return this.outputSignalSockets[id] as OutputSignalSocket;
    }
  }

  protected getOutputSignalSockets(): OutputSignalSocket[] {
    return Object.values(this.outputSignalSockets) as OutputSignalSocket[];
  }

  protected addInputDataSocket<TData>(id: string): InputDataSocket<TData> {
    if (this.inputDataSockets[id]) {
      throw new Error(`Input data socket "${id}" already exist`);
    } else {
      this.inputDataSockets[id] = new InputDataSocket<TData>();
      return this.getInputDataSocket(id);
    }
  }

  protected getInputDataSocket<TData>(id: string): InputDataSocket<TData> {
    if (!this.inputDataSockets[id]) {
      throw new Error(`Input data socket "${id}" does not exist`);
    } else {
      return this.inputDataSockets[id] as InputDataSocket<TData>;
    }
  }

  protected getInputDataSockets(): InputDataSocket<unknown>[] {
    return Object.values(this.inputDataSockets) as InputDataSocket<unknown>[];
  }

  protected addOutputDataSocket<TData>(id: string): OutputDataSocket<TData> {
    if (this.outputDataSockets[id]) {
      throw new Error(`Output data socket "${id}" already exist`);
    } else {
      this.outputDataSockets[id] = new OutputDataSocket<TData>();
      return this.getOutputDataSocket(id);
    }
  }

  protected getOutputDataSocket<TData>(id: string): OutputDataSocket<TData> {
    if (!this.outputDataSockets[id]) {
      throw new Error(`Output data socket "${id}" does not exist`);
    } else {
      return this.outputDataSockets[id] as OutputDataSocket<TData>;
    }
  }

  protected getOutputDataSockets(): OutputDataSocket<unknown>[] {
    return Object.values(this.outputDataSockets) as OutputDataSocket<unknown>[];
  }
}
