import { spawn } from "child_process";
import { Service } from "../Service";

export class HudService extends Service {
  constructor() {
    super("HudService");
  }

  public run(): boolean {
    //save PID
    console.log(`Starting: ${this.name}`);

    this.execProcess = spawn("node", ["../Hud/dist/index.js"], {
      env: process.env,
    });
    // this.execProcess = spawn("node", ["../Hud/dist/out.js"]);
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
