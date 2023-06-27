import { LedMatrix, LedMatrixInstance, Font } from 'rpi-led-matrix';
import fs from 'fs/promises';
import path from 'path';
import { matrixOptions, runtimeOptions } from './config/_config';
import { ImageToIcon } from '../../Hud/src/utils/ImageToIcon/index';

/** Make environment variables available */
import dotenv from 'dotenv';
dotenv.config();

function drawImage(
  matrix: LedMatrixInstance,
  x: number,
  y: number,
  imageData: any
) {
  const oldColor = matrix.fgColor();
  console.log(imageData.length);
  for (let lines = 0; lines < imageData.length; lines++) {
    for (let rows = 0; rows < imageData[lines].length; rows++) {
      matrix.fgColor(imageData[lines][rows]);
      matrix.setPixel(x + lines, y + rows);
    }
  }
  matrix.fgColor(oldColor);
}

(async () => {
  try {
    /**
     * Instanciate new Matrix, clear it and set the drawing color to white
     */
    const matrix = new LedMatrix(matrixOptions, runtimeOptions);
    let folder = `${process.cwd()}/../ImageSlider/src/testimage/`;
    if (process.env.IMAGE_FOLDER) {
      folder = process.env.IMAGE_FOLDER;
    }
    let images = await fs.readdir(folder);

    images = images.filter((image) => {
      const extension = path.extname(image).toLowerCase();
      return (
        extension === '.jpg' || extension === '.png' || extension === '.jpeg'
      );
    });
    if (!images.length) {
      console.log(`No Images found in folder: ${folder}`);
      throw new Error(`No Images found in folder: ${folder}`);
    }
    let counter = 0;

    setInterval(async () => {
      matrix.clear().fgColor(0xffffff).brightness(100);

      if (!images[counter]) {
        counter = 0;
      }
      const img = new ImageToIcon({
        pathToImage: `${folder}${images[counter]}`,
        targetWidth: matrix.width(),
        targetHeight: matrix.height(),
        crop: false,
      });
      const data = await img.getPixelArrayAsync();
      drawImage(matrix, 0, 0, data);
      counter++;
      matrix.sync();
    }, 5000);
  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();
