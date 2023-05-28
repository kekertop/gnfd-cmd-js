import './modules/bucket';
import './modules/account';
import './modules/group';
import './modules/head';
import './modules/object';
import './modules/payment';
import './modules/storageProviders';
import './modules/crosschain';
import './modules/config';

import commander from "commander";
import {CommandGroupHolder} from "./cli-decorators/commandGroup";

const program = new commander.Command();

for (const command of CommandGroupHolder.getInstance().commands) {
  program.addCommand(command);
}

program.parse(process.argv);