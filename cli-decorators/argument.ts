import "reflect-metadata";
import commander from "commander";
import getParams from "../utils/functionUtils";
import {InputType} from "../utils/inputType";
import {parser} from "../utils/inputParser";

const argumentMetadataKey = 'cli-argument';

export interface CLIArgument {
  description?: string,
  defaultValue?: string,
  alias?: string,
  type?: InputType
}

export interface CLIArgumentDescriptor {
  argument: commander.Argument,
  parameterName: string,
  parameterIndex: number
}

export function argument(value: CLIArgument) {
  return function (target: Object, methodName: string, parameterIndex: number) {
    const methodArguments: CLIArgumentDescriptor[] = Reflect.getOwnMetadata(argumentMetadataKey, target, methodName) || [];

    const parameterName = getParameterName(target[methodName as keyof Object], parameterIndex);
    methodArguments.push({
      argument: buildArgument(value, value.alias ?? parameterName),
      parameterName: parameterName,
      parameterIndex: parameterIndex
    });

    Reflect.defineMetadata(argumentMetadataKey, methodArguments, target, methodName);
  };
}

function getParameterName(method: Function, index: number) {
  return getParams(method)[index];
}

function buildArgument(argument: CLIArgument, name: string): commander.Argument {
  const commanderArgument = new commander.Argument(`<${name}>`, argument.description);

  if (argument.defaultValue) {
    commanderArgument.argOptional();
    commanderArgument.default(argument.defaultValue);
    commanderArgument.argParser(parser(argument.type));
  }

  return commanderArgument;
}