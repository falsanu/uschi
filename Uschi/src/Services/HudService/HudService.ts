import { Service } from "../Service";

export class HudService extends Service {
  constructor() {
    super("HudService");
  }

  public run(): boolean {
    //save PID
    console.log(`Run attempt: ${this.name}`);
    return true;
  }
}
