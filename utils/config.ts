const {promises: fs} = require('fs');
const path = require('path');
const {createInterface} = require('readline/promises');

export interface Config {
  rpcAddress: string,
  chainId: string,
  password: string
}

export class ConfigService {
  private readonly configLocation: string;
  private config: Config;

  constructor(configLocation: string) {
    this.configLocation = configLocation;
  }

  public async getConfig(): Promise<Config> {
    if (this.config) {
      return this.config;
    }

    const config = await this.readConfig();

    this.config = config;

    return config;
  }

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
      console.log('about to write')

      await fs.mkdir(path.dirname(this.configLocation), {recursive: true});
      await fs.writeFile(this.configLocation, JSON.stringify(config), {mode: '777'});

      console.log('wrote')
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
    const password = await rl.question("Password: ");

    return {
      rpcAddress: rpcAddress,
      chainId: chainId,
      password: password
    }
  }

}