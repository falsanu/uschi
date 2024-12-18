import { LedMatrix, Font } from 'rpi-led-matrix';

import { matrixOptions, runtimeOptions } from './config/_config';
import { Calendar } from './calendar';

import { Weather } from './Weather';
import dotenv from 'dotenv';
import { School } from './school';
dotenv.config();

const font = new Font(
  'spleen-5x8.bdf',
  `${process.cwd()}/../HudSchool/fonts/spleen-5x8.bdf`
);
const titleFont = new Font(
  'spleen-8x16.bdf',
  `${process.cwd()}/../HudSchool/fonts/spleen-8x16.bdf`
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
     * Calendar
     * Kids
     */

    let weather = new Weather();
    let calendar = new Calendar();
    let schoolHelena = new School({
      name: "Helena",
      plan: [
        //mo,   di,   mi, do, fr
        ["-", "Mu", "N", "E", "P"],     // 1.Stunde
        ["E", "Sp", "N", "D", "P"],     // 2.Stunde
        ["E", "Sp", "Sp", "N", "Ma"],   // 3.Stunde
        ["D", "G", "Ma", "N", "Ma"],    // 4.Stunde
        ["D", "Ma", "D", "D", "-"],     // 5.Stunde
        ["Ma", "E", "Ku", "Mu", "-"],   // 6.Stunde
        ["G", "-", "Ku", "G", "-"],     // 7.Stunde
      ],
      appointments:
        ["Mo: Karate, Di: Drums, Mi: Karate"]

    });
    let schoolMathilda = new School(
      {
        name: "Mathilda",
        plan: [
          //mo,   di,   mi,   do,   fr
          ["De", "MB", "Sa", "De", "Ma"],     // 1.Stunde
          ["Ma", "De", "De", "Mu", "De"],     // 2.Stunde
          ["Mu", "Ku", "Ma", "De", "VHG"],    // 3.Stunde
          ["Lk", "Ku", "VHG", "Ma", "Sa"],    // 4.Stunde
          ["-", "Ma", "De", "De", "Sp"],      // 5.Stunde
          ["-", "Sp", "Foe", "Sp", "-"],      // 6.Stunde
          ["-", "-", "-", "-", "-"],          // 7.Stunde
        ],
        appointments:
          ["Mo: Karate, Di: Drums, Do: Karate"]
      });



    /**
     * Iterate through all content provider
     */
    const entries: any[] = [calendar, schoolHelena, schoolMathilda]; // Deine Liste
    let index = 1;
    let currentContent = entries[index];


    // Funktion, die den aktuellen Content setzt anzeigt
    function setCurrentContent() {

      index = (index + 1) % entries.length; // Zum nächsten Eintrag wechseln, zurück zu 0 am Ende
      currentContent = entries[index];
      console.log(entries[index]); // Aktuellen Eintrag anzeigen
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

      // Write the main Content
      currentContent.writeToDisplay(matrix, 4, 26);

      weather.writeWeatherData(matrix);
      matrix.sync();
      counter2++;
    }, 1000);
  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();
