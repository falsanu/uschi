
import { Service } from "../Service";

export class HudSchool extends Service {
  constructor() {
    super("HudSchool");
    this.command = "node";
    this.execArgs = ["../HudSchool/dist/index.js"]
  }
  
}
