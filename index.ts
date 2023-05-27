import "./modules/bucket";
import {CommandGroupHolder} from "./cli-decorators/commandGroup";
import commander from "commander";

const program = new commander.Command();

for (const command of CommandGroupHolder.getInstance().commands) {
  program.addCommand(command);
}

program.parse(process.argv);