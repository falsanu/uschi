import axios from 'axios';
import {
  LedMatrixInstance,
  LedMatrix,
  LayoutUtils,
  FontInstance,
  Font,
  HorizontalAlignment,
  VerticalAlignment,
} from 'rpi-led-matrix';

const font = new Font(
  'spleen-5x8.bdf',
  `${process.cwd()}/../Hud/fonts/spleen-5x8.bdf`
);
type OctoOptionsObject = {
  apiKey: string;
  apiUrl: string;
  ledMatrix: LedMatrixInstance;
};

/**
 * OctoPrint for connecting with OctoAPI and write content on the display
 * using following API-Description: https://docs.octoprint.org/en/master/api/index.html
 *
 *
 */
export class OctoPrint {
  private apiKey: string = '';
  private apiUrl: string;
  private ledMatrix: LedMatrixInstance;
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

  public jobStatus: any = {
    job: {
      averagePrintTime: null,
      estimatedPrintTime: null,
      filament: null,
      file: {
        date: 1687348695,
        display: 'pikachu_piggybank_v3_0.2mm_PLA_X1_17h8m.gcode',
        name: 'pikachu_piggybank_v3_0.2mm_PLA_X1_17h8m.gcode',
        origin: 'local',
        path: 'pikachu_piggybank_v3_0.2mm_PLA_X1_17h8m.gcode',
        size: 30444235,
      },
      lastPrintTime: null,
      user: '3duschi',
    },
    progress: {
      completion: 43.84316111079815,
      filepos: 13347715,
      printTime: 25008,
      printTimeLeft: 31760,
      printTimeLeftOrigin: 'estimate',
    },
    state: 'Printing',
  };

  constructor(options: OctoOptionsObject) {
    this.apiKey = options.apiKey;
    this.apiUrl = options.apiUrl;
    this.ledMatrix = options.ledMatrix;
  }
  getCallConfig(): any {
    return { headers: { 'x-api-key': this.apiKey } };
  }
  async getStatusData() {
    try {
      const response = await axios.get(
        `${this.apiUrl}/job`,
        this.getCallConfig()
      );
      this.jobStatus = response.data;
      //console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.status);
        console.error(error.response);
      } else {
        console.error(error);
      }
    }
  }

  writeStatus(headerHeight: number = 0) {
    let x = headerHeight;
    this.ledMatrix.font(font);

    const oldColor = this.ledMatrix.fgColor();

    // Write Logo
    this.drawImageToPosition(this.logo, 30, 30);

    // Write Status of current Job
    this.ledMatrix.fgColor(0xffffff);
    this.drawLineHelper('OctoPrint Status:', 55, 30);
    console.log('Job Status', this.jobStatus.state);
    this.ledMatrix.drawText(this.jobStatus.state, 55, 40);

    this.drawLineHelper('File:' + this.jobStatus.job.file.name, 55, 50);

    this.ledMatrix.drawText(
      this.jobStatus.progress.completion.toFixed(2) + ' %',
      55,
      60
    );
    this.ledMatrix.fgColor(oldColor);
  }

  drawImageToPosition(image: Array<any>, x: number, y: number) {
    const oldColor = this.ledMatrix.fgColor();

    for (let lines = 0; lines < image.length; lines++) {
      for (let rows = 0; rows < image[lines].length; rows++) {
        this.ledMatrix.fgColor(getRGBValue(image[lines][rows]));
        this.ledMatrix.setPixel(x + rows, y + lines);
      }
    }
    this.ledMatrix.fgColor(oldColor);
  }

  updateLED() {
    console.log('Updating Octo-View');
    this.writeStatus();
  }

  drawLineHelper(text: string, x: number, y: number) {
    const lines = LayoutUtils.textToLines(
      font,
      this.ledMatrix.width() - 50,
      text
    );
    let line = [];
    if (lines.length > 1) {
      line.push(lines[0]);
    } else {
      line = lines;
    }
    const glyphs = LayoutUtils.linesToMappedGlyphs(
      line,
      font.height(),
      this.ledMatrix.width(),
      this.ledMatrix.height(),
      HorizontalAlignment.Left,
      VerticalAlignment.Middle
    );
    for (const glyph of glyphs) {
      this.ledMatrix.drawText(glyph.char, glyph.x + x, y);
    }
  }
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
