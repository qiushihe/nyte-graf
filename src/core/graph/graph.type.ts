import { Block } from "~nyte-graf-core/block";
import { Pipe } from "~nyte-graf-core/pipe";

export type BlockInstance = {
  id: string;
  name: string;
  block: Block;
};

export type PipeInstance = {
  id: string;
  transport: string;
  fromInstanceId: string;
  fromSocketId: string;
  toInstanceId: string;
  toSocketId: string;
  pipe: Pipe;
};
