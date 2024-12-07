export class Service implements Service {
  name: string;
  pid = 0;
  execProcess: any;

  constructor(name: string) {
    this.name = name;
    console.log(`Service instantiated: ${this.name}`);
  }

  public run(): boolean {
    //save PID
    console.log(`Run attempt: ${this.name}`);
    return true;
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
