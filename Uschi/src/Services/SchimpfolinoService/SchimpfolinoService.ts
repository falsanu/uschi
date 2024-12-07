import { spawn } from "child_process";
import { Service } from "../Service";

export class SchimpfolinoService extends Service {
  constructor() {
    super("SchimpfolinoService");
  }

  public run(): boolean {
    //save PID
    console.log(`Starting: ${this.name}`);

    this.execProcess = spawn("node", ["../Schimpfolino/dist/index.js"], {
      env: process.env,
    });
    this.execProcess.on("spawn", () => {
      console.log("Spawned Schimpfolino Process");
    });
    this.execProcess.stdout.on("data", (data: any) => {
      console.log(`${this.name} Process on stdout: ${data}`);
    });
    this.execProcess.stderr.on("data", (data: any) => {
      console.log(`${this.name} Process on error ${data}`);
    });
    this.execProcess.on("exit", (code: any, signal: any) => {
      console.log(`${this.name} Process on exit code: ${code} signal: ${signal}`);
    });
    this.execProcess.on("close", (code: number, args: any[]) => {
      console.log(`${this.name} Process on close code: ${code} args: ${args}`);
    });
    return true;
  }
}
