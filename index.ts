import './modules/bucket';
import './modules/account';
import './modules/cmd_group';
import './modules/cmd_head';
import './modules/cmd_object';
import './modules/cmd_payment';
import './modules/cmd_sp';
import './modules/crosschain';
import './modules/config';

import commander from "commander";
import {CommandGroupHolder} from "./cli-decorators/commandGroup";

const program = new commander.Command();

for (const command of CommandGroupHolder.getInstance().commands) {
  program.addCommand(command);
}

program.parse(process.argv);