import { Args, Command, Flags } from "@oclif/core";
// import * as inquirer from "inquirer";
import select, { Separator } from "@inquirer/select";
import { ServiceManager } from "../../ServiceManager/ServiceManager";
import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import http from "http";

const { Server } = require("socket.io");


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

    console.log("Message")

    this.serviceManager.runService("DrawService"); // start Service on startup

    const app: Express = express();
    const port = process.env.PORT || 3000;
    app.use(cors());
    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

    app.use(express.static("/opt/uschi-frontend"));




    app.get("/startservice/:service", (req: Request, res: Response) => {
      const service = req.params.service;
      console.log("Should start service", req.params.service);


      switch (service) {
        case "hud":
          this.serviceManager.runService("HudService");
          break;
        case "hudschool":
          this.serviceManager.runService("HudSchool");
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
        case "draw":
          this.serviceManager.runService("DrawService");
          break;
        case "off":
          this.serviceManager.stopAll();
          break;
      }

      res.json({ service: req.params.service });

    });

    app.post("/message", (req: Request, res: Response) => {
      console.log("Got Message:", req.body)
      if (this.serviceManager.activeService) {
        console.log("trying to send message to service:", req.body.message)
        this.serviceManager.activeService.send({type:"text", data:req.body.message})
      }
      res.json(req.body)
    })


    var server = app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });

    var io = require('socket.io')(server, {
      cors: {
        origin: `http://localhost:5173`,
        methods: ["GET", "POST"]
      }
    });  //pass a http.Server instance

    io.on('connection', (socket: any) => {
      console.log('a user connected');
      socket.on('data', (data:any) => {
        console.log("Uschi-Webserver received data", data);
        if (this.serviceManager.activeService) {
          this.serviceManager.activeService.send(data)
        }
      });
    });


  }
}
