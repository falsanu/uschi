import axios from 'axios';
import { LedMatrixInstance, Font } from 'rpi-led-matrix';
import { replaceUmlaute, getMinutes, drawTextLineHelper } from '../utils';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Request data from BVG-REST-API and display them on the matrix
 *
 * https://v6.bvg.transport.rest/getting-started.html
 */
export class BVG {
  private BVGData: Array<any>;
  private updateInterval: number = 15000;
  private updater: any;
  private font = new Font(
    'spleen-5x8.bdf',
    `${process.cwd()}/../Hud/fonts/spleen-5x8.bdf`
  );

  constructor() {
    this.BVGData = [];
    this.updateBVGData();
    // update data every n seconds
    this.updater = setInterval(
      this.updateBVGData.bind(this),
      this.updateInterval
    );
  }

  updateBVGData(stations?: Array<string>) {
    if (!stations) {
      if (process.env.BVG_STATIONS) {
        stations = process.env.BVG_STATIONS.split(' ');
      } else {
        console.log('No Stations given');
        return;
      }
    }

    console.log('Updating BVG-Data for:', stations);
    this.BVGData = [];
    stations.forEach(async (item) => {
      try {
        const response = await axios.get(
          `https://v6.bvg.transport.rest/stops/${item}/departures?results=10`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.departures) {
          this.BVGData.push(
            ...response.data.departures
              .filter((item: any) => item.line.product === 'tram')
              .map((item: any) => {
                const dir = replaceUmlaute(item.destination.name);
                const now = new Date();
                const planned = new Date(item.plannedWhen);
                const min = getMinutes(now, planned) + "'";
                return {
                  line: item.line.name,
                  dir,
                  min,
                };
              })
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.status);
          console.error(error.response);
        } else {
          console.error(error);
        }
      }
    });
  }

  writeBVG(matrix: LedMatrixInstance) {
    matrix.font(this.font);
    const oldColor = matrix.fgColor();
    matrix.fgColor(0xffffff);

    this.BVGData.sort((a: any, b: any) => parseInt(a.min) - parseInt(b.min));
    this.BVGData = this.BVGData.slice(0, 7);
    if (this.BVGData.length > 0) {
      this.BVGData.forEach((item: any, i) => {
        drawTextLineHelper(item.dir, 50, 30 + 10 * i, matrix, this.font, false); // write direction
        matrix.drawText(item.line, 30, 30 + 10 * i); // write tram infos
        matrix.drawText(item.min, 10, 30 + 10 * i); // write the time
      });
    }
    matrix.fgColor(oldColor);
  }
}
