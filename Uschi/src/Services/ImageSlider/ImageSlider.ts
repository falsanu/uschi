import { spawn } from "child_process";
import { Service } from "../Service";

export class ImageSliderService extends Service {
  constructor() {
    super("ImageSlider");
  }

  public run(): boolean {
    //save PID
    console.log(`Starting: ${this.name}`);

    // this.execProcess = spawn("node", ["../ImageSlider/dist/index.js"], {
    //   env: process.env,
    // });

    this.execProcess = spawn("/home/pi/_LED-Tests/rpi-rgb-led-matrix/utils/led-image-viewer", [
      "--led-rows=64",
      "--led-cols=64",
      "--led-chain=3",
      "--led-parallel=2",
      "--led-panel-type=FM6126A",
      "--led-no-hardware-pulse",
      "-w5",
      "-f",
      "/home/pi/_LED-Tests/rpi-rgb-led-matrix/utils/animation-out.stream"
    ]);


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
