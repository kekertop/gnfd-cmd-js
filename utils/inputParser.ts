import {InputType} from "./inputType";

export function parser(type: InputType) {
  return (value: string, _: any) => parse(value, type);
}

function parse(value: string, type: InputType) {
  switch (type) {
    case InputType.STRING:
      return value;
    case InputType.NUMBER:
      return parseNumber(value);
    case InputType.BOOLEAN:
      return parseBoolean(value);
  }
}

function parseNumber(value: string) {
  const number = Number(value);

  if (number) {
    return number;
  }

  throw new Error('Unable to parse number value!');
}

function parseBoolean(value: string) {
  if (["y", "yes", "t", "true"].includes(value.toLowerCase())) {
    return true;
  }

  if (["n", "no", "f", "false"].includes(value.toLowerCase())) {
    return false;
  }

  throw new Error('Unable to parse boolean value!')
}