import { spawn } from "child_process";
import { Service } from "../Service";

export class ImageSliderService extends Service {
  constructor() {
    super("ImageSlider");
  }

  public run(): boolean {
    //save PID
    console.log(`Starting: ${this.name}`);

    this.execProcess = spawn("ts-node", ["../ImageSlider/src/index.ts"], {
      env: process.env,
    });
    // this.execProcess = spawn("node", ["../Hud/dist/out.js"]);
    this.execProcess.on("spawn", () => {
      console.log("Spawned ImageSlider Process");
    });
    this.execProcess.stdout.on("data", (data: any) => {
      console.log(`ImageSlider Process on stdout: ${data}`);
    });
    this.execProcess.stderr.on("data", (data: any) => {
      console.log(`ImageSlider Process on error ${data}`);
    });
    this.execProcess.on("exit", (code: any, signal: any) => {
      console.log(
        `ImageSlider Process on exit code: ${code} signal: ${signal}`
      );
    });
    this.execProcess.on("close", (code: number, args: any[]) => {
      console.log(`ImageSlider Process on close code: ${code} args: ${args}`);
    });
    return true;
  }
}
