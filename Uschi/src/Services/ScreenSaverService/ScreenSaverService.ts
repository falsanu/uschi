import { spawn } from "child_process";
import { Service } from "../Service";

export class ScreenSaverService extends Service {
  constructor() {
    super("ScreenSaverService");
  }

  public run(): boolean {
    //save PID
    console.log(`Starting: ${this.name}`);

    this.execProcess = spawn("ts-node", ["../ScreenSaver/src/index.ts"]);
    this.execProcess.on("spawn", () => {
      console.log("Spawned ScreenSaver Process");
    });
    this.execProcess.stdout.on("data", (data: any) => {
      console.log(`ScreenSaver Process on stdout: ${data}`);
    });
    this.execProcess.stderr.on("data", (data: any) => {
      console.log(`ScreenSaver Process on error ${data}`);
    });
    this.execProcess.on("exit", (code: any, signal: any) => {
      console.log(
        `ScreenSaver Process on exit code: ${code} signal: ${signal}`
      );
    });
    this.execProcess.on("close", (code: number, args: any[]) => {
      console.log(`ScreenSaver Process on close code: ${code} args: ${args}`);
    });
    return true;
  }
}
