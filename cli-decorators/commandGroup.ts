import {CommandHolder} from "./command";
import commander from "commander";

export interface CommandGroup {
  prefix: string,
  description?: string
}

export class CommandGroupHolder {
  public commands: commander.Command[];

  private static instance: CommandGroupHolder;

  private constructor() {
    this.commands = [];
  }

  public static getInstance(): CommandGroupHolder {
    if (!CommandGroupHolder.instance) {
      CommandGroupHolder.instance = new CommandGroupHolder();
    }

    return CommandGroupHolder.instance;
  }
}

export function commandGroup(value: CommandGroup) {
  return function (target: any) {
    const targetMethods = getMethods(target);
    const commands = (CommandHolder.getInstance().commands ?? [])
    .filter(commandDescriptor => targetMethods.has(commandDescriptor.method))
    .map(commandDescriptor => commandDescriptor.command);

    if (commands.length > 0) {
      const command = new commander.Command(value.prefix);

      if (value.description) {
        command.description(value.description);
      }

      for (const subCommand of commands) {
        command.addCommand(subCommand);
      }

      CommandGroupHolder.getInstance().commands.push(command);
    }
  }
}

function getMethods(target: any): Set<string> {
  const properties: string[] = Object.getOwnPropertyNames(target.prototype);

  return new Set(properties.sort()
  .filter(e => {
    if (typeof target.prototype[e] == 'function' && e != 'constructor') {
      return true;
    }
  }));
}