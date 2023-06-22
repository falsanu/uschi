import {
  LedMatrixInstance,
  LedMatrix,
  LayoutUtils,
  FontInstance,
  Font,
  HorizontalAlignment,
  VerticalAlignment,
} from 'rpi-led-matrix';

import { matrixOptions, runtimeOptions } from './config/_config';
import axios from 'axios';
import { OctoPrint } from './octoPrint';
import { BVG } from './BVG';
import dotenv from 'dotenv';
dotenv.config();

const wait = (t: number) => new Promise((ok) => setTimeout(ok, t));
const runUntil = 1000;
let counter = 0;
const font = new Font(
  'spleen-5x8.bdf',
  `${process.cwd()}/../Hud/fonts/spleen-5x8.bdf`
);
const titleFont = new Font(
  'spleen-8x16.bdf',
  `${process.cwd()}/../Hud/fonts/spleen-8x16.bdf`
);

/**
 * Weather Data
 */
let weatherData: any;

function writeWeatherData(matrix: LedMatrixInstance) {
  if (weatherData.current) {
    const text = weatherData.current + ' °C';
    if (weatherData.daily.weathercode) {
      switch (weatherData.daily.weathercode[0]) {
        case 0:
        case 1:
        case 2:
        case 3:
          drawSun(matrix, 8, 8);
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
          drawCloud(matrix, 8, 8);
          break;
      }
      matrix.drawText(text, 16, 8);
    } else {
      //console.log(weatherData);
    }
  }
}

function drawSun(
  matrix: LedMatrixInstance,
  x: number,
  y: number,
  radius: number = 4
) {
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

function drawCloud(matrix: LedMatrixInstance, x: number, y: number) {
  const oldColor = matrix.fgColor();
  matrix.fgColor(0x95aaba);
  matrix.drawCircle(x, y, 4);

  matrix.fgColor(oldColor);
}

function roundMinutes(date: Date) {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
  date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

  return date;
}

async function updateWeatherData() {
  const response = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=Europe%2FBerlin`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  weatherData = response.data;
  const slot = weatherData.hourly.time.findIndex((item: string) => {
    if (new Date(item) < roundMinutes(new Date())) {
    } else if (new Date(item) > roundMinutes(new Date())) {
    } else {
      return true;
    }
  });
  //console.log(slot);
  weatherData.current = weatherData.hourly.temperature_2m[slot];
  //console.log(weatherData);
}

let counter2 = 0;
let flip: Boolean = false;
let flipContent: Boolean = true;

(() => {
  try {
    const matrix = new LedMatrix(matrixOptions, runtimeOptions);
    matrix.clear().fgColor(0xffffff).brightness(100);

    updateWeatherData();

    let octo = new OctoPrint({
      apiKey: process.env.OCTO_API_KEY || '19E0FDC96B114444A1DA6C00D20DCBE6', // has been updated anyhow
      apiUrl: process.env.OCTO_API_URL || 'http://192.168.1.198/api',
      ledMatrix: matrix,
    });

    let bvg = new BVG();
    bvg.updateBVGData();

    octo.updateLED();

    const interval = setInterval(() => {
      if (flipContent) {
        //write Octo Content
        octo.getStatusData();
      } else {
        bvg.updateBVGData();
      }
      flipContent = !flipContent;

      // get updated data every 30 seconds for BVG
    }, 30000);

    const weatherInterval = setInterval(() => {
      updateWeatherData();
    }, 1800000);

    const updateTime = setInterval(() => {
      matrix.clear().brightness(80);
      matrix.fgColor(0x075078);
      matrix.font(titleFont);
      matrix.drawText('USCHI', 150, 2);
      matrix.drawLine(2, 24, matrix.width() - 2, 24);
      matrix.fgColor(0xffffff);
      matrix.font(font);
      const now = new Date();
      const options: any = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      };
      let text: string;
      // matrix.drawText('Donnerstag', 10, 60);

      if (counter2 == 30) {
        flip = !flip;
        counter2 = 0;
      }
      if (flip) {
        text = now.toLocaleDateString('de-DE', options);
      } else {
        text = now.toLocaleString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      }

      matrix.drawText(text, 150, 14);
      if (flipContent) {
        octo.updateLED();
      } else {
        bvg.writeBVG(matrix);
      }

      writeWeatherData(matrix);
      matrix.sync();
      counter2++;
    }, 1000);

    // const updateBVGInterval = setInterval(() => {
    //   writeBVG(matrix);
    // }, 10000);

    // matrix.afterSync((mat, dt, t) => {

    // writeBVG(matrix);
    // setTimeout(() => matrix.sync(), 1000);
    // });
    // matrix.sync();
  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();
