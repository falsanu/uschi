import axios from 'axios';
import { LedMatrixInstance, Font } from 'rpi-led-matrix';
import {
  replaceUmlaute,
  getMinutes,
  drawTextLineHelper,
  roundMinutes,
} from '../utils';

const font = new Font(
  'spleen-5x8.bdf',
  `${process.cwd()}/../Hud/fonts/spleen-5x8.bdf`
);
export class Weather {
  weatherData: any;
  updateInterval: number = 1800000;
  updater: any;
  constructor() {
    this.updateWeatherData();
    this.updater = setInterval(this.updateWeatherData, this.updateInterval);
  }

  writeWeatherData(matrix: LedMatrixInstance) {
    if (this.weatherData.current) {
      const text = this.weatherData.current + ' °C';
      if (this.weatherData.daily.weathercode) {
        switch (this.weatherData.daily.weathercode[0]) {
          case 0:
          case 1:
          case 2:
          case 3:
            this.drawSun(matrix, 8, 8);
            break;
          case 61:
          case 63:
          case 65:
          case 66:
          case 67:
          case 80:
          case 81:
          case 82:
          case 95:
          case 96:
          case 99:
            this.drawCloud(matrix, 8, 8);
            break;
        }
        matrix.drawText(text, 16, 8);
      } else {
        //console.log(weatherData);
      }
    }
  }

  async updateWeatherData() {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=Europe%2FBerlin`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    this.weatherData = response.data;
    const slot = this.weatherData.hourly.time.findIndex((item: string) => {
      if (new Date(item) < roundMinutes(new Date())) {
      } else if (new Date(item) > roundMinutes(new Date())) {
      } else {
        return true;
      }
    });
    //console.log(slot);
    this.weatherData.current = this.weatherData.hourly.temperature_2m[slot];
    //console.log(weatherData);
  }

  drawSun(matrix: LedMatrixInstance, x: number, y: number, radius: number = 4) {
    const oldColor = matrix.fgColor();
    const oldBGColor = matrix.bgColor();

    matrix.fgColor(0xf5d742);
    matrix.bgColor(0xf5d742);
    while (radius > 0) {
      matrix.drawCircle(x, y + radius, radius--);
    }
    matrix.fgColor(oldColor);
    matrix.bgColor(oldBGColor);
  }

  drawCloud(matrix: LedMatrixInstance, x: number, y: number) {
    const oldColor = matrix.fgColor();
    matrix.fgColor(0x95aaba);
    matrix.drawCircle(x, y, 4);

    matrix.fgColor(oldColor);
  }
}
