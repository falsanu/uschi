import { LedMatrix, Font } from 'rpi-led-matrix';

import { matrixOptions, runtimeOptions } from './config/_config';
import { OctoPrint } from './octoPrint';
import { BVG } from './BVG';
import { Calendar } from './calendar';

import { Weather } from './Weather';
import dotenv from 'dotenv';
import { Soccer } from './soccer';
dotenv.config();

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
    const contentProvider: any[] = []; // Items which were presented on the screen

    let weather = new Weather();

    
    if (process.env.BVG_STATIONS) {
      const stations = process.env.BVG_STATIONS.split(' ');
      let bvg = new BVG(stations);
      contentProvider.push(bvg)
    }

    if (process.env.OCTO_API_URL && process.env.OCTO_API_KEY) {
      const apiKey: string = process.env.OCTO_API_KEY || '';
      const apiUrl: string = process.env.OCTO_API_URL || '';

      let octo = new OctoPrint(apiUrl, apiKey);
      if (!octo.hasConnection()) {
        return;
      }
      contentProvider.push(octo);
    }

    if (process.env.CALENDAR_URL) {
      let calendar = new Calendar(process.env.CALENDAR_URL);
      contentProvider.push(calendar)
    }

    let soccerbl1 = new Soccer('bl1');
    let soccerbl2 = new Soccer('bl2');
    contentProvider.push(soccerbl1)
    contentProvider.push(soccerbl2)
    


    /**
     * Iterate through all content provider
     */

    let index = 0;
    let currentContentProvider = contentProvider[index];


    // Funktion, die den aktuellen Content setzt anzeigt
    function setCurrentContent() {

      index = (index + 1) % contentProvider.length; // Zum nächsten Eintrag wechseln, zurück zu 0 am Ende
      currentContentProvider = contentProvider[index];
      console.log(contentProvider[index]); // Aktuellen Eintrag anzeigen
    }

    // Alle 15 Sekunden die Funktion ausführen
    setInterval(setCurrentContent, 15000); // 15000 ms = 15 Sekunden




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


      // Write the main Content
      // console.log(currentContentProvider)
      currentContentProvider.writeToDisplay(matrix, 4, 28);

      weather.writeWeatherData(matrix);
      matrix.sync();
      counter2++;
    }, 1000);
  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();
