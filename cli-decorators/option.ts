import "reflect-metadata";
import commander from "commander";
import getParams from "../utils/functionUtils";
import {InputType} from "../utils/inputType";
import {parser} from "../utils/inputParser";

const optionMetadataKey = 'cli-option';

export interface CLIOption {
  long: string,
  short?: string,
  optionMandatory?: boolean,
  valueMandatory?: boolean,
  type?: InputType,
  valueAlias?: string,
  description?: string,
  defaultValue?: string,
  choices?: string[]
}

export interface CLIOptionDescriptor {
  option: commander.Option,
  optionAlias: string,
  parameterName: string,
  parameterIndex: number
}

export function option(value: CLIOption) {
  return function (target: Object, methodName: string, parameterIndex: number) {
    const methodArguments: CLIOptionDescriptor[] = Reflect.getOwnMetadata(optionMetadataKey, target, methodName) || [];
    const parameterName = getParameterName(target[methodName as keyof Object], parameterIndex);

    value.valueAlias = value.type === InputType.BOOLEAN ? undefined : (value.valueAlias ?? 'value');

    methodArguments.push({
      option: buildOption(value),
      optionAlias: value.valueAlias,
      parameterName: parameterName,
      parameterIndex: parameterIndex
    });

    Reflect.defineMetadata(optionMetadataKey, methodArguments, target, methodName);
  };
}

function getParameterName(method: Function, index: number) {
  return getParams(method)[index];
}

function buildOption(option: CLIOption) {
  const commanderOption = new commander.Option(buildFlag(option), option.description);
  commanderOption.default(option.defaultValue);

  if (option.type != InputType.BOOLEAN) {
    commanderOption.argParser(parser(option.type));
  }

  if (option.choices) {
    if (option.type && (option.type == InputType.NUMBER || option.type == InputType.BOOLEAN)) {
      throw new Error('Unable to provide choices with non-string input type');
    }

    commanderOption.choices(option.choices);
  }

  return commanderOption;
}

function buildFlag(option: CLIOption) {
  return `-${option.short ?? ''} --${option.long} ${buildTag(option)}`
}

function buildTag(option: CLIOption) {
  const valueMandatory = option.valueMandatory === undefined || option.valueMandatory;

  if (option.type === InputType.BOOLEAN) {
    if (option.valueMandatory) {
      throw new Error("Can't set value mandatory option on boolean options.");
    }

    return '';
  }

  const valueAlias = option.valueAlias ?? 'value';

  return valueMandatory ? `<${valueAlias}>` : `[${valueAlias}]`;
}