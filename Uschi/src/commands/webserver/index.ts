import { Args, Command, Flags } from "@oclif/core";
// import * as inquirer from "inquirer";
import select, { Separator } from "@inquirer/select";
import { ServiceManager } from "../../ServiceManager/ServiceManager";
import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";


export default class Webserver extends Command {
  serviceManager = new ServiceManager();

  static description = "Starts a Webserver to control Uschi";

  static examples = [`$ uschi spawn hud`];

  static flags = {

  };

  static args = {
    service: Args.string(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Webserver);
    this.log(`Spawning a Service (./src/commands/spawn/index.ts)`);


    const app: Express = express();
    const port = process.env.PORT || 3000;
    app.use(cors());
    app.use(express.static("/opt/uschi-frontend"));
   
    app.get("/startservice/:service", (req: Request, res: Response) => {
      const service = req.params.service;
      console.log("Should start service", req.params.service);
      

      switch (service) {
        case "hud":
          this.serviceManager.runService("HudService");
          break;
        case "imageslider":
          this.serviceManager.runService("ImageSlider");
          break;
        case "video":
          this.serviceManager.runService("VideoService");
          break;
        case "screensaver":
          this.serviceManager.runService("ScreenSaverService");
          break;
        case "schimpfolino":
          this.serviceManager.runService("SchimpfolinoService");
          break;
        case "off":
            this.serviceManager.stopAll();
            break;
      }

      res.json({ service: req.params.service });

    });

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });

  }
}
