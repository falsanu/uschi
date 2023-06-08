import { spawn } from "child_process";
import { Service } from "../Service";

export class VideoService extends Service {
  pid = 0;
  videoUrl = "";
  constructor() {
    super("VideoService");
  }

  public run(): boolean {
    console.log("running VideoService");

    this.execProcess = spawn("../Video/video-viewer", [
      "--led-rows=64",
      "--led-cols=64",
      "--led-chain=3",
      "--led-parallel=2",
      "--led-panel-type=FM6126A",
      "--led-no-hardware-pulse",
      "../Video/test.mp4",
      "-f",
    ]);

    this.execProcess.on("spawn", () => {
      console.log("Spawned HUD Process");
    });
    this.execProcess.stdout.on("data", (data: any) => {
      console.log(`HUD Process on stdout: ${data}`);
    });
    this.execProcess.stderr.on("data", (data: any) => {
      console.log(`HUD Process on error ${data}`);
    });
    this.execProcess.on("exit", (code: any, signal: any) => {
      console.log(`HUD Process on exit code: ${code} signal: ${signal}`);
    });
    this.execProcess.on("close", (code: number, args: any[]) => {
      console.log(`HUD Process on close code: ${code} args: ${args}`);
    });
    return true;
  }
}
