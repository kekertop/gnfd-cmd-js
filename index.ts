import "./modules/bucket";
import { CommandGroupHolder } from "./cli-decorators/commandGroup";
import commander from "commander";
import {ConfigService} from "./modules/config";

ConfigService.getInstance('/Users/zhan/.bnb/config.json');

const program = new commander.Command();

for (const command of CommandGroupHolder.getInstance().commands) {
  program.addCommand(command);
}

program.parse(process.argv);
