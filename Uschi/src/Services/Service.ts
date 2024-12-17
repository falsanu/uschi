import { spawn } from "child_process";

export class Service implements Service {
  name: string;
  command: string;
  execArgs: string[];
  pid = 0;
  execProcess: any;

  constructor(name: string, command?:string, execArgs?:string[] ) {
    this.name = name;
    this.command = command || "";
    this.execArgs = execArgs || [];
    console.log(`Service instantiated: ${this.name}`);
    console.log(`Path to Exectable: ${this.command}`);
    console.log(`Path to Exectable: ${this.execArgs}`);
  }

  public run(): boolean {

    this.execProcess = spawn(this.command, this.execArgs, {
      env: process.env,
    });
    
    this.execProcess.on("spawn", () => {
      console.log("Spawned HUD Process");
    });

    setInterval(()=>{
      this.execProcess.send("Message");
    },1000)

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
  
  public send(msg:string) {
    console.log("sendingMessages not implemented for service")
  }
  public kill(): boolean {
    try {
      this.execProcess.kill("SIGHUP");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
