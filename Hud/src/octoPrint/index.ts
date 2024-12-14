import axios from 'axios';
import { LedMatrixInstance, Font } from 'rpi-led-matrix';
import { drawTextLineHelper } from '../utils';
import dotenv from 'dotenv';
dotenv.config();
const font = new Font(
  'spleen-5x8.bdf',
  `${process.cwd()}/../Hud/fonts/spleen-5x8.bdf`
);

/**
 * OctoPrint for connecting with OctoAPI and write content on the display
 * using following API-Description: https://docs.octoprint.org/en/master/api/index.html
 *
 *
 */
export class OctoPrint {
  private apiKey: string = '';
  private apiUrl: string = '';
  private logo: Array<Array<any>> = [
    [
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0xff00c012, 0xff00c012, 0xff00c012, 0xff00bf13, 0xff00c013, 0xff00c012,
      0xff00c012, 0xff00c112, 0xff00c013, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0xff00c012,
      0xff00c012, 0xff00c012, 0xff00c013, 0xff00c311, 0xff00c511, 0xff00c412,
      0xff00c412, 0xff00c412, 0xff00c411, 0xff00c212, 0xff00c112, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0x00000000, 0x00000000, 0xff00c112, 0xff00bf12, 0xff00c012,
      0xff00c012, 0xff00c112, 0xff00c313, 0xff00b613, 0xff00a414, 0xff009a15,
      0xff009515, 0xff009a15, 0xff00a714, 0xff00bd12, 0xff00c312, 0xff00c111,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0x00000000, 0xff00c112, 0xff00c012, 0xff00c012, 0xff00bf12,
      0xff00c412, 0xff00bb12, 0xff009715, 0xff008e16, 0xff008e16, 0xff009016,
      0xff009016, 0xff009017, 0xff008e16, 0xff008f15, 0xff00a914, 0xff00c611,
      0xff00c012, 0x00000000,
    ],
    [
      0x00000000, 0x00000000, 0xff00c012, 0xff00c112, 0xff00bf13, 0xff00c312,
      0xff00bc12, 0xff008e15, 0xff008f15, 0xff009215, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0xff008a16, 0xff00a814,
      0xff00c511, 0x00000000,
    ],
    [
      0x00000000, 0xff00c012, 0xff00c012, 0xff00c112, 0xff00c111, 0xff00c211,
      0xff009615, 0xff009015, 0xff009314, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0xff008b17,
      0xff00b313, 0xff00c512,
    ],
    [
      0x00000000, 0xff00c012, 0xff00c012, 0xff00c012, 0xff00c312, 0xff00ad13,
      0xff008e16, 0xff009315, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0xff009f14, 0xff00bd12,
    ],
    [
      0x00000000, 0xff00c012, 0xff00c012, 0xff00bf12, 0xff00c412, 0xff009915,
      0xff009115, 0xff009215, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0xff00c013, 0xff00c012, 0xff00c012, 0xff00be12, 0xff009415,
      0xff009215, 0xff009215, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0xff00c112, 0xff00bf11, 0xff00c012, 0xff00c112, 0xff00bb12, 0xff009015,
      0xff009315, 0xff009215, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0xff00c112, 0xff00c012, 0xff00c013, 0xff00c112, 0xff00bd12, 0xff009215,
      0xff009215, 0xff009215, 0xff009215, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0xff00c013, 0xff00c012, 0xff00bf12, 0xff00c212, 0xff009615,
      0xff009115, 0xff009215, 0xff009215, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0xff00c012, 0xff00c012, 0xff00c012, 0xff00c512, 0xff00a114,
      0xff009015, 0xff009215, 0xff009215, 0xff009215, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0xff00c011, 0xff00c012, 0xff00c012, 0xff00c312, 0xff00b013,
      0xff008f16, 0xff009315, 0xff009215, 0xff009215, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0xff00c011, 0xff00c012, 0xff00c012, 0xff00c212, 0xff00be12,
      0xff009115, 0xff009115, 0xff009315, 0xff009216, 0xff009214, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0xff00c012, 0xff00c012, 0xff00c012, 0xff00c112, 0xff00c213,
      0xff009914, 0xff008f16, 0xff009315, 0xff009216, 0xff009215, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0x00000000, 0xff00c012, 0xff00c013, 0xff00c112, 0xff00c511,
      0xff00a114, 0xff008e15, 0xff009316, 0xff009215, 0xff009215, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000,
    ],
    [
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x000000,
    ],
  ];
  private updater: any;
  private updateInterval = 15000;

  public jobStatus: any = {};

  constructor(apiUrl: string = '', apiKey: string = '') {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;

    if (!this.hasConnection()) {
      return;
    }

    this.getStatusData();
    this.updater = setInterval(
      this.getStatusData.bind(this),
      this.updateInterval
    );
  }

  hasConnection(): boolean {
      const url = `${this.apiUrl}/job`;
      console.log('Checking Connection', url);
      const response = axios.get(url, {
        headers: { 'x-api-key': this.apiKey },
      }).catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        return false;
      });
      return true;
  }
  
  async getStatusData() {
    try {
      const url = `${this.apiUrl}/job`;
      console.log('Fetching OctoData', url);
      const response = await axios.get(url, {
        headers: { 'x-api-key': this.apiKey },
      });
      this.jobStatus = response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.status);
        console.error(error.response);
      } else {
        console.error(error);
      }
    }
  }

  writeToDisplay(matrix: LedMatrixInstance, headerHeight: number = 0) {
    let x = headerHeight;
    matrix.font(font);

    const oldColor = matrix.fgColor();

    // Write Logo
    this.drawImageToPosition(matrix, this.logo, 30, 30);

    matrix.fgColor(0xffffff);
    if (this.jobStatus.state) {
      try {
        // Write Status of current Job
        drawTextLineHelper('OctoPrint Status:', 55, 30, matrix, font, false);
        matrix.drawText(this.jobStatus.state, 55, 40);
        if (this.jobStatus.job && this.jobStatus.job.file) {
          drawTextLineHelper(
            'File: ' + this.jobStatus.job.file.name.substring(0, 15),
            55,
            50,
            matrix,
            font,
            false
          );
        }
        if (this.jobStatus.progress && this.jobStatus.progress.completion) {
          matrix.drawText(
            this.jobStatus.progress.completion.toFixed(2) + ' %',
            55,
            60
          );
        }
      } catch (error: any) {
        console.log(error);
      }
    } else {
      //state not fetched yet
      drawTextLineHelper(
        'fetching OctoPrint data',
        55,
        30,
        matrix,
        font,
        false
      );
    }

    matrix.fgColor(oldColor);
  }

  drawImageToPosition(
    matrix: LedMatrixInstance,
    image: Array<any>,
    x: number,
    y: number
  ) {
    const oldColor = matrix.fgColor();

    for (let lines = 0; lines < image.length; lines++) {
      for (let rows = 0; rows < image[lines].length; rows++) {
        matrix.fgColor(getRGBValue(image[lines][rows]));
        matrix.setPixel(x + rows, y + lines);
      }
    }
    matrix.fgColor(oldColor);
  }

  // updateLED() {
  //   console.log('Updating Octo-View');
  //   this.writeStatus();
  // }
}

function getRGBValue(input: number): number {
  const hexValue = input;
  const transformedHex =
    ((hexValue & 0xff) << 16) |
    ((hexValue >> 8) & 0xff00) |
    ((hexValue >> 24) & 0xff);
  // const transformedHexStr = '0x' + transformedHex.toString(16).padStart(6, '0');
  return transformedHex;
  //   console.log(transformedHexStr); // Output: 0x12c000
}
