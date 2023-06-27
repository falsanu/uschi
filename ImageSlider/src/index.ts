import { LedMatrix, LedMatrixInstance, Font } from 'rpi-led-matrix';
import fs from 'fs/promises';
import path from 'path';
import { matrixOptions, runtimeOptions } from './config/_config';
import { ImageToIcon } from '../../Hud/src/utils/ImageToIcon/index';

const font = new Font(
  'spleen-5x8.bdf',
  `${process.cwd()}/../Hud/fonts/spleen-5x8.bdf`
);

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
    matrix.font(font);
    let images = await fs.readdir(
      `${process.cwd()}/../ImageSlider/src/testimage/`
    );
    images = images.filter((image) => {
      const extension = path.extname(image).toLowerCase();
      return (
        extension === '.jpg' || extension === '.png' || extension === '.jpeg'
      );
    });
    let counter = 0;

    setInterval(async () => {
      matrix.clear().fgColor(0xffffff).brightness(100);

      if (!images[counter]) {
        counter = 0;
      }
      const img = new ImageToIcon({
        pathToImage: `${process.cwd()}/../ImageSlider/src/testimage/${
          images[counter]
        }`,
        targetWidth: matrix.width(),
        targetHeight: matrix.height(),
        crop: false,
      });
      const data = await img.getPixelArrayAsync();
      drawImage(matrix, 0, 0, data);
      counter++;
      matrix.sync();
    }, 5000);

    // showImage
  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();
