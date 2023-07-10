export type BlockAttributeValue = string | number | boolean;

export type BlockAttribute = {
  name: string;
  description: string;

  // These are serialized attribute/default values so they're always `string`.
  defaultValue: string;
  value: string;
};
