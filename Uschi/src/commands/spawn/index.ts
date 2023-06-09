import { Args, Command, Flags } from "@oclif/core";
// import * as inquirer from "inquirer";
import select, { Separator } from "@inquirer/select";
import { ServiceManager } from "../../ServiceManager/ServiceManager";
export default class Spawn extends Command {
  serviceManager = new ServiceManager();

  static description = "Spawns a service";

  static examples = [`$ uschi spawn hud`];

  static flags = {
    service: Flags.string({
      char: "t",
      description: "define timezone, default Europe/Berlin",
      required: false,
      options: ["hud", "screensaver", "video", "exit"],
    }),
  };

  static args = {
    service: Args.string(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Spawn);
    this.log(`Spawning a Service (./src/commands/spawn/index.ts)`);
    let service = flags.service;
    let exit = false;
    while (!exit) {
      const answer: any = await select({
        message: "Select a service",
        choices: [
          new Separator(),
          { name: "HUD", value: "hud" },
          { name: "Screensaver", value: "screensaver" },
          { name: "Video", value: "video" },
          { name: "exit", value: "exit" },
        ],
      });

      service = answer;
      switch (service) {
        case "hud":
          this.serviceManager.runService("HudService");
          break;
        case "video":
          this.serviceManager.runService("VideoService");
          break;
        case "screensaver":
          this.serviceManager.runService("ScreenSaverService");
          break;
        case "exit":
          exit = true;
      }
    }
  }
}
