import {
  IInputSocket,
  InputDataSocket,
  InputSignalSocket,
  IOutputSocket,
  OutputDataSocket,
  OutputSignalSocket
} from "~nyte-graf-core/socket";

import { BlockAttribute } from "./block.type";

export abstract class Block {
  private readonly attributes: Record<string, BlockAttribute>;
  private readonly inputSignalSockets: Record<string, IInputSocket>;
  private readonly outputSignalSockets: Record<string, IOutputSocket>;
  private readonly inputDataSockets: Record<string, IInputSocket>;
  private readonly outputDataSockets: Record<string, IOutputSocket>;

  public constructor() {
    this.attributes = {};
    this.inputSignalSockets = {};
    this.outputSignalSockets = {};
    this.inputDataSockets = {};
    this.outputDataSockets = {};
    this.initialize();
  }

  protected initialize(): void {}

  protected addAttribute(name: string, description: string, defaultValue: any) {
    this.attributes[name] = {
      name,
      description,
      defaultValue: this.serializeAttributeValue(defaultValue),
      value: this.serializeAttributeValue(null)
    };
  }

  public setAttribute<TType extends string | number | boolean>(name: string, value: TType) {
    const attribute = this.attributes[name] || null;
    if (attribute) {
      attribute.value = this.serializeAttributeValue(value);
    } else {
      throw new Error(`Missing attribute ${name}`);
    }
  }

  public getAttribute<TType extends string | number | boolean>(name: string): TType | null {
    const attribute = this.attributes[name] || null;
    if (attribute) {
      const attributeValue = attribute.value;
      if (attributeValue === null || attributeValue === undefined) {
        const attributeDefaultValue = attribute.defaultValue;
        if (attributeDefaultValue === null || attributeDefaultValue === undefined) {
          return null;
        } else {
          return this.deserializeAttributeValue(attributeDefaultValue) as TType;
        }
      } else {
        return this.deserializeAttributeValue(attributeValue) as TType;
      }
    } else {
      return null;
    }
  }

  private serializeAttributeValue(value: unknown): string | null {
    return value === null || value === undefined ? JSON.stringify(null) : JSON.stringify(value);
  }

  private deserializeAttributeValue(value: string | null) {
    return value === null || value === undefined ? null : JSON.parse(value);
  }

  protected addInputSignalSocket(id: string): InputSignalSocket {
    if (this.inputSignalSockets[id]) {
      throw new Error(`Input signal socket "${id}" already exist`);
    } else {
      this.inputSignalSockets[id] = new InputSignalSocket();
      return this.getInputSignalSocket(id);
    }
  }

  public getInputSignalSocket(id: string): InputSignalSocket {
    if (!this.inputSignalSockets[id]) {
      throw new Error(`Input signal socket "${id}" does not exist`);
    } else {
      return this.inputSignalSockets[id] as InputSignalSocket;
    }
  }

  public getInputSignalSockets(): InputSignalSocket[] {
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

  public getOutputSignalSocket(id: string): OutputSignalSocket {
    if (!this.outputSignalSockets[id]) {
      throw new Error(`Output signal socket "${id}" does not exist`);
    } else {
      return this.outputSignalSockets[id] as OutputSignalSocket;
    }
  }

  public getOutputSignalSockets(): OutputSignalSocket[] {
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

  public getInputDataSocket<TData>(id: string): InputDataSocket<TData> {
    if (!this.inputDataSockets[id]) {
      throw new Error(`Input data socket "${id}" does not exist`);
    } else {
      return this.inputDataSockets[id] as InputDataSocket<TData>;
    }
  }

  public getInputDataSockets(): InputDataSocket<unknown>[] {
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

  public getOutputDataSocket<TData>(id: string): OutputDataSocket<TData> {
    if (!this.outputDataSockets[id]) {
      throw new Error(`Output data socket "${id}" does not exist`);
    } else {
      return this.outputDataSockets[id] as OutputDataSocket<TData>;
    }
  }

  public getOutputDataSockets(): OutputDataSocket<unknown>[] {
    return Object.values(this.outputDataSockets) as OutputDataSocket<unknown>[];
  }
}
