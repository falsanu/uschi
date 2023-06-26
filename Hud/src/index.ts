import { LedMatrix, Font } from 'rpi-led-matrix';

import { matrixOptions, runtimeOptions } from './config/_config';
import { OctoPrint } from './octoPrint';
import { BVG } from './BVG';

import { Weather } from './Weather';
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

let counter2 = 0;
let flip: Boolean = false;
let flipContent: Boolean = true;

(() => {
  try {
    /**
     * Instanciate new Matrix, clear it and set the drawing color to white
     */
    const matrix = new LedMatrix(matrixOptions, runtimeOptions);
    matrix.clear().fgColor(0xffffff).brightness(100);

    /**
     * Instanciate all "Widgets"
     * Weather
     * OctoPi connection
     * BVG connection
     */

    let weather = new Weather();
    let bvg = new BVG();
    let octo = new OctoPrint();
    // octo.updateLED();
    const changeScreenInterval = setInterval(() => {
      flipContent = !flipContent;
    }, 15000);
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

      if (counter2 == 15) {
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
        octo.writeStatus(matrix);
      } else {
        bvg.writeBVG(matrix);
      }

      weather.writeWeatherData(matrix);
      matrix.sync();
      counter2++;
    }, 1000);
  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();
