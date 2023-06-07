import { Service } from "../Service";

export class VideoService extends Service {
  pid = 0;
  videoUrl = "";
  constructor() {
    super("VideoService");
  }

  public run(): boolean {
    console.log("running VideoService");
    return true;
  }
}
