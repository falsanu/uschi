import { LedMatrix, Font } from 'rpi-led-matrix';

import { matrixOptions, runtimeOptions } from './config/_config';

import dotenv from 'dotenv';
import { drawTextLineHelper } from './utils';
dotenv.config();

const font = new Font(
  'spleen-5x8.bdf',
  `${process.cwd()}/../Hud/fonts/spleen-5x8.bdf`
);
const titleFont = new Font(
  'spleen-8x16.bdf',
  `${process.cwd()}/../Hud/fonts/spleen-8x16.bdf`
);



const drawHeader = (matrix: any) => {

  matrix.fgColor(0x075078);
  matrix.font(titleFont);
  matrix.drawText('USCHI', 150, 2);
  matrix.drawLine(2, 24, matrix.width() - 2, 24);

}

(async () => {
  try {
    let text = { x: 0, y: 0 };
    process.on('message', (data = { type: "text", data: "" }) => {
      console.log('Node-TS Draw Service got Data: ', data)

      if (data.type && data.type == "text") {
        const text = data.data;
        matrix.font(font);
        matrix.fgColor(0xFFFFFF);
        matrix.drawText(text, 10, 50);
      } else {
        const pos = data.data;
        matrix.bgColor(0x000000);
        matrix.fgColor(0x000000);
        matrix.drawRect(10, 118, 182, 10)
        matrix.font(font);
        matrix.fgColor(0xFFFFFF);
        matrix.drawText(`x: ${pos.x}`, 10, 118);
        matrix.drawText(`y: ${pos.y}`, 40, 118);

        matrix.drawCircle(pos.x, pos.y, 1);
        // matrix.setPixel(data.data.x, data.data.y);
      }

      matrix.afterSync((mat, dt, t) => {
        counter++;
        if (counter > runUntil) {
          counter = 0;
          resetMatrix();
        }
        bubbles.forEach((item) => {
          item.update();
          item.draw();
        });
  
        setTimeout(() => matrix.sync(), 20);
      });
      matrix.sync();
    })
    /**
     * Instanciate new Matrix, clear it and set the drawing color to white
     */
    const matrix = new LedMatrix(matrixOptions, runtimeOptions);
    matrix.clear().fgColor(0xffffff).brightness(100);

    drawHeader(matrix);
    matrix.sync();


  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();
