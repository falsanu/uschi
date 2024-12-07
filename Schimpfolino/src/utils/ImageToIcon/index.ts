import { Canvas, createCanvas, Image, loadImage } from 'canvas';
import * as fs from 'fs';
import Jimp = require('jimp');
import { resolve } from 'path';

type imageToIconOptions = {
  pathToImage: string;
  targetWidth: number;
  targetHeight: number;
  crop?: boolean;
};

export class ImageToIcon {
  private pathToImage: string;
  private targetWidth: number;
  private targetHeight: number;
  private canvas: any;
  private ctx: any;
  private pixelData = new Array();
  private image: any = null;
  private crop: boolean = true;
  constructor(options: imageToIconOptions) {
    this.pathToImage = options.pathToImage;
    this.targetWidth = options.targetWidth;
    this.targetHeight = options.targetHeight;
    if (options.crop === false) {
      this.crop = options.crop;
    }
    console.log(options);
  }

  init() {
    return new Promise(async (resolve) => {
      this.image = await Jimp.read(this.pathToImage);
      if (this.crop) {
        this.image.autocrop();
      }
      this.image.resize(this.targetWidth, Jimp.AUTO);
      resolve(this.image);
    });
  }
  // Read image data & write on canvas

  async getPixelArrayAsync(): Promise<Array<Array<Object>>> {
    const that = this;
    if (!this.image) {
      await this.init();
    }
    return new Promise(async (resolve) => {
      const data: Array<Array<Object>> = [];
      await that.image.scan(
        0,
        0,
        that.image.bitmap.width,
        that.image.bitmap.height,
        (x: number, y: number, idx: number) => {
          if (!data[x]) {
            data[x] = new Array();
          }
          var red = that.image.bitmap.data[idx + 0];
          var green = that.image.bitmap.data[idx + 1];
          var blue = that.image.bitmap.data[idx + 2];
          var alpha = that.image.bitmap.data[idx + 3];
          data[x][y] = { r: red, g: green, b: blue };
        }
      );
      resolve(data);
    });
  }
  // return Pixel-Array
  async getPixelArray() {
    if (this.pixelData.length > 0) {
      return this.pixelData;
    } else {
      return await this.getPixelArrayAsync();
    }
  }
}
