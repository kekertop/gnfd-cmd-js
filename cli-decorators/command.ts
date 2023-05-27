import {CLIArgumentDescriptor} from "./argument";
import commander from 'commander';
import {CLIOptionDescriptor} from "./option";
import getParams from "../utils/functionUtils";
import {camelize} from "../utils/stringUtils";

const argumentMetadataKey = 'cli-argument';
const optionMetadataKey = 'cli-option';

export interface Command {
  name: string,
  description?: string,
}

export interface CommandDescriptor {
  command: commander.Command,
  method: string
}

export class CommandHolder {
  public commands: CommandDescriptor[];

  private static instance: CommandHolder;

  private constructor() {
    this.commands = [];
  }

  public static getInstance(): CommandHolder {
    if (!CommandHolder.instance) {
      CommandHolder.instance = new CommandHolder();
    }

    return CommandHolder.instance;
  }
}

export function command(value: Command) {
  return function (target: any, methodName: string, propertyDescriptor: PropertyDescriptor) {
    const method = propertyDescriptor.value;
    const params = getParams(method);

    const argumentDescriptors: CLIArgumentDescriptor[] = (Reflect.getOwnMetadata(argumentMetadataKey, target, methodName) || []).sort(byIndex);
    const optionDescriptors: CLIOptionDescriptor[] = (Reflect.getOwnMetadata(optionMetadataKey, target, methodName) || []).sort(byIndex);

    const command = buildCommand(value, argumentDescriptors, optionDescriptors)
    .action(function (...args) {
      const cliArguments: Array<string> = args.slice(0, argumentDescriptors.length);
      const cliOptions: Object = arguments[argumentDescriptors.length];
      const command: commander.Command = arguments[argumentDescriptors.length + 1];

      method.apply(command, buildArguments(params, cliArguments, argumentDescriptors, cliOptions, optionDescriptors));
    });

    CommandHolder.getInstance().commands.push({
      command: command,
      method: methodName
    })
  }
}

function buildArguments(params: string[],
                        cliArguments: string[],
                        argumentDescriptors: CLIArgumentDescriptor[],
                        cliOptions: Object,
                        optionDescriptors: CLIOptionDescriptor[]) {
  const args = Array(params.length);

  for (const paramName of params) {
    const argumentDescriptor = argumentDescriptors.find(arg => arg.parameterName === paramName);
    if (argumentDescriptor) {
      const argumentValueIndex = argumentDescriptors.indexOf(argumentDescriptor);
      args[argumentDescriptor.parameterIndex] = cliArguments[argumentValueIndex];
    }

    const optionDescriptor = optionDescriptors.find(opt => opt.parameterName === paramName);
    if (optionDescriptor) {
      args[optionDescriptor.parameterIndex] = cliOptions[camelize(optionDescriptor.option.long.replace('--', '')) as keyof Object];
    }
  }

  return args;
}

function buildCommand(command: Command, argumentDescriptors: CLIArgumentDescriptor[], optionDescriptors: CLIOptionDescriptor[]): commander.Command {
  const commanderCommand = new commander.Command(command.name);
  if (command.description) {
    commanderCommand.description(command.description);
  }

  [...argumentDescriptors, ...optionDescriptors]
  .sort(byIndex)
  .forEach(param => {
    if (isArgumentDescriptor(param)) {
      commanderCommand.addArgument(param.argument);
    } else if (isOptionDescriptor(param)) {
      commanderCommand.addOption(param.option);
    }
  });

  return commanderCommand;
}

function isArgumentDescriptor(object: any): object is CLIArgumentDescriptor {
  return 'argument' in object;
}

function isOptionDescriptor(object: any): object is CLIOptionDescriptor {
  return 'option' in object;
}

function byIndex<T extends CLIOptionDescriptor | CLIArgumentDescriptor>(a: T, b: T): number {
  return a.parameterIndex - b.parameterIndex;
}
