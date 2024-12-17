"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageToIcon = void 0;
const Jimp = require("jimp");
class ImageToIcon {
    constructor(options) {
        this.pixelData = new Array();
        this.image = null;
        this.crop = true;
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
    async getPixelArrayAsync() {
        const that = this;
        if (!this.image) {
            await this.init();
        }
        return new Promise(async (resolve) => {
            const data = [];
            await that.image.scan(0, 0, that.image.bitmap.width, that.image.bitmap.height, (x, y, idx) => {
                if (!data[x]) {
                    data[x] = new Array();
                }
                var red = that.image.bitmap.data[idx + 0];
                var green = that.image.bitmap.data[idx + 1];
                var blue = that.image.bitmap.data[idx + 2];
                var alpha = that.image.bitmap.data[idx + 3];
                data[x][y] = { r: red, g: green, b: blue };
            });
            resolve(data);
        });
    }
    // return Pixel-Array
    async getPixelArray() {
        if (this.pixelData.length > 0) {
            return this.pixelData;
        }
        else {
            return await this.getPixelArrayAsync();
        }
    }
}
exports.ImageToIcon = ImageToIcon;
