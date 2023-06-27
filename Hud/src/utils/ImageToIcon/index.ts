import { Canvas, createCanvas, Image, loadImage } from 'canvas';
import * as fs from 'fs';
import Jimp = require('jimp');

type imageToIconOptions = {
  pathToImage: string;
  targetWidth: number;
  targetHeight: number;
};

export class ImageToIcon {
  private pathToImage: string;
  private targetWidth: number;
  private targetHeight: number;
  private canvas: any;
  private ctx: any;
  private pixelData = new Array();
  private image: any = null;

  constructor(options: imageToIconOptions) {
    this.pathToImage = options.pathToImage;
    this.targetWidth = options.targetWidth;
    this.targetHeight = options.targetHeight;
    console.log(options);
    this.canvas = createCanvas(this.targetWidth, this.targetHeight);
    this.ctx = this.canvas.getContext('2d');
    this.readImage();
  }

  // Read image data & write on canvas

  async readImage() {
    try {
      console.log('Reading Image');
      this.image = await Jimp.read(this.pathToImage);
      this.image.autocrop();
      this.image.resize(10, Jimp.AUTO);
      await this.image.scan(
        0,
        0,
        this.image.bitmap.width,
        this.image.bitmap.height,
        (x: number, y: number, idx: number) => {
          if (!this.pixelData[x]) {
            this.pixelData[x] = new Array();
          }
          var red = this.image.bitmap.data[idx + 0];
          var green = this.image.bitmap.data[idx + 1];
          var blue = this.image.bitmap.data[idx + 2];
          var alpha = this.image.bitmap.data[idx + 3];
          this.pixelData[x][y] = { r: red, g: green, b: blue };
        }
      );
    } catch (error: any) {
      console.error(error.message);
    }
  }

  // return Pixel-Array
  getPixelArray() {
    return this.pixelData;
  }
}
