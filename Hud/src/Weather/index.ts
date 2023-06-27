import axios from 'axios';
import { LedMatrixInstance, Font } from 'rpi-led-matrix';
import { roundMinutes } from '../utils';
import { ImageToIcon } from '../utils/ImageToIcon';

const font = new Font(
  'spleen-5x8.bdf',
  `${process.cwd()}/../Hud/fonts/spleen-5x8.bdf`
);
export class Weather {
  weatherData: any = {
    latitude: 52.52,
    longitude: 13.419998,
    generationtime_ms: 0.34499168395996094,
    utc_offset_seconds: 7200,
    timezone: 'Europe/Berlin',
    timezone_abbreviation: 'CEST',
    elevation: 38.0,
    hourly_units: { time: 'iso8601', temperature_2m: '°C' },
    hourly: {
      time: [
        '2023-06-26T00:00',
        '2023-06-26T01:00',
        '2023-06-26T02:00',
        '2023-06-26T03:00',
        '2023-06-26T04:00',
        '2023-06-26T05:00',
        '2023-06-26T06:00',
        '2023-06-26T07:00',
        '2023-06-26T08:00',
        '2023-06-26T09:00',
        '2023-06-26T10:00',
        '2023-06-26T11:00',
        '2023-06-26T12:00',
        '2023-06-26T13:00',
        '2023-06-26T14:00',
        '2023-06-26T15:00',
        '2023-06-26T16:00',
        '2023-06-26T17:00',
        '2023-06-26T18:00',
        '2023-06-26T19:00',
        '2023-06-26T20:00',
        '2023-06-26T21:00',
        '2023-06-26T22:00',
        '2023-06-26T23:00',
      ],
      temperature_2m: [
        20.4, 19.8, 18.6, 18.0, 17.7, 17.3, 17.6, 19.2, 21.4, 23.6, 25.5, 27.5,
        28.6, 29.7, 30.4, 31.0, 30.9, 21.9, 21.4, 21.4, 20.7, 20.2, 19.5, 18.2,
      ],
    },
    daily_units: {
      time: 'iso8601',
      weathercode: 'wmo code',
      temperature_2m_max: '°C',
      temperature_2m_min: '°C',
    },
    daily: {
      time: ['2023-06-26'],
      weathercode: [96],
      temperature_2m_max: [31.0],
      temperature_2m_min: [17.3],
    },
  };
  updateInterval: number = 10 * 60 * 1000;
  updater: any;
  currentIcon: any = new Array();
  currentIconCode: string = '';

  constructor() {
    this.updateWeatherData();
    this.updater = setInterval(
      this.updateWeatherData.bind(this),
      this.updateInterval
    );
  }

  writeWeatherData(matrix: LedMatrixInstance) {
    if (this.weatherData && this.weatherData.current) {
      const text = this.weatherData.current + ' °C';
      let icon = '';
      if (this.weatherData.daily.weathercode) {
        switch (this.weatherData.daily.weathercode[0]) {
          case 0:
            icon = 'wsymbol_0001_sunny.png';
            break;
          case 1:
            icon = 'wsymbol_0002_sunny_intervals.png';
            break;
          case 2:
            icon = 'wsymbol_0003_white_cloud.png';
            break;

          case 3:
            icon = 'wsymbol_0004_black_low_cloud.png';
            break;
          case 45:
            icon = 'wsymbol_0006_mist.png';
            break;
          case 48:
            icon = 'wsymbol_0007_fog.png';
            break;
          case 51:
          case 53:
          case 55:
            icon = 'wsymbol_0017_cloudy_with_light_rain.png';
            break;
          case 61:
          case 63:
          case 65:
            icon = 'wsymbol_0018_cloudy_with_heavy_rain.png';
            break;
          case 66:
          case 67:
            icon = 'wsymbol_0021_cloudy_with_sleet.png';
            break;
          case 71:
            icon = 'wsymbol_0019_cloudy_with_light_snow.png';
            break;
          case 73:
          case 75:
            icon = 'wsymbol_0020_cloudy_with_heavy_snow.png';
            break;
          case 80:
          case 81:
            icon = 'wsymbol_0017_cloudy_with_light_rain.png';
            break;
          case 82:
            icon = 'wsymbol_0018_cloudy_with_heavy_rain.png';
            break;
          case 85:
          case 86:
            icon = 'wsymbol_0021_cloudy_with_sleet.png';
            break;
          case 95:
          case 96:
          case 99:
            icon = 'wsymbol_0024_thunderstorms.png';
            break;
        }

        this.loadIcon(icon);
        matrix.drawText(text, 25, 10);
      } else {
        //console.log(weatherData);
      }
    }
    this.drawIcon(matrix, 12, 10);
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
    this.weatherData.current = this.weatherData.hourly.temperature_2m[slot];
  }

  loadIcon(icon: string) {
    if (this.currentIconCode !== icon) {
      const cloudIcon = new ImageToIcon({
        pathToImage: `${process.cwd()}/../Hud/src/Weather/weather-icons/png/${icon}`,
        targetWidth: 10,
        targetHeight: 10,
      });
      this.currentIcon = cloudIcon.getPixelArray();
      this.currentIconCode = icon;
    }
  }

  drawIcon(matrix: LedMatrixInstance, x: number, y: number) {
    const oldColor = matrix.fgColor();
    for (let lines = 0; lines < this.currentIcon.length; lines++) {
      for (let rows = 0; rows < this.currentIcon[lines].length; rows++) {
        matrix.fgColor(this.currentIcon[lines][rows]);
        matrix.setPixel(x + lines, y + rows);
      }
    }
    matrix.fgColor(oldColor);
  }
}
