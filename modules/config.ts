import {createInterface} from "readline/promises";

import {promises as fs} from "fs";
import path from "path";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import * as os from "os";

export interface Config {
  rpcAddress: string,
  chainId: string,
  publicKey: string,
  privateKey: string
}

@commandGroup({prefix: 'config', instanceProvider: () => ConfigService.getInstance()})
export class ConfigService {
  private readonly configLocation: string;
  private config: Config;

  private static instance: ConfigService;

  private constructor() {
    this.configLocation = path.resolve(os.homedir(), '.bnb/config.json');
  }

  public static getInstance(): ConfigService {
    if (!this.instance) {
      this.instance = new ConfigService();
    }

    return this.instance;
  }

  public async getConfig(): Promise<Config> {
    if (this.config) {
      return this.config;
    }

    const config = await this.readConfig();

    this.config = config;

    return config;
  }

  @command({name: 'configure', description: 'Configure BNBChain client'})
  public async storeConfig(): Promise<void> {
    const config = await this.processConfigInput();

    return await this.saveConfig(config);
  }


  protected async readConfig(): Promise<Config> {
    try {
      const buffer = await fs.readFile(this.configLocation);
      const data = buffer.toString();

      return JSON.parse(data);
    } catch (ex) {
      throw new Error('Error occurred while reading config file.')
    }
  }

  private async saveConfig(config: Config): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.configLocation), {recursive: true});
      await fs.writeFile(this.configLocation, JSON.stringify(config), {mode: '777'});

      console.log(`Successfully wrote config into ${this.configLocation}`);
    } catch (ex) {
      throw new Error('Error occurred while saving config.');
    }
  }

  private async processConfigInput(): Promise<Config> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const rpcAddress = await rl.question("RPC Address: ");
    const chainId = await rl.question("Chain ID: ");
    const publicKey = await rl.question("Public Key: ");
    const privateKey = await rl.question('Private Key: ');

    rl.close();

    return {
      rpcAddress: rpcAddress,
      chainId: chainId,
      publicKey: publicKey,
      privateKey: privateKey
    }
  }

}