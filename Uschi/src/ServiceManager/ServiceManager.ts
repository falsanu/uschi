import { HudService } from "../Services/HudService/HudService";
import { Service } from "../Services/ServiceInterface";
import { VideoService } from "../Services/VideoService/VideoService";

export class ServiceManager {
  activeService: Service | null;
  services: Array<Service> = [];

  constructor() {
    this.activeService = null;
    this.registerServices();
  }

  private registerServices() {
    // think about iterating over ServicesFolder (later perhaps Plugins-Foleder)
    // for now we just instantiate the services we know

    const videoService = new VideoService();
    this.services.push(videoService);

    const hudService = new HudService();
    this.services.push(hudService);
  }

  private pickService(service: string): any {
    console.log(service);
    return this.services.find((e) => e.name === service);
  }

  public runService(service: string): boolean {
    const nextService: Service = this.pickService(service);

    if (!nextService) {
      console.log(`Service not found - ${service}`);
      return false;
    }

    if (
      this.activeService &&
      nextService &&
      nextService !== this.activeService
    ) {
      this.activeService.kill(); // do we need await here?
    }

    console.log(nextService);
    nextService.run();
    this.activeService = nextService;

    return true;
  }
}
