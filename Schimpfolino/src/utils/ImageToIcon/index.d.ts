type imageToIconOptions = {
    pathToImage: string;
    targetWidth: number;
    targetHeight: number;
    crop?: boolean;
};
export declare class ImageToIcon {
    private pathToImage;
    private targetWidth;
    private targetHeight;
    private canvas;
    private ctx;
    private pixelData;
    private image;
    private crop;
    constructor(options: imageToIconOptions);
    init(): Promise<unknown>;
    getPixelArrayAsync(): Promise<Array<Array<Object>>>;
    getPixelArray(): Promise<any[]>;
}
export {};
