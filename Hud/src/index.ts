import {
  LedMatrixInstance,
  LedMatrix,
  LayoutUtils,
  FontInstance,
  Font,
  HorizontalAlignment,
  VerticalAlignment,
} from 'rpi-led-matrix';
import * as dayjs from 'dayjs';
import { matrixOptions, runtimeOptions } from './config/_config';
import axios from 'axios';

const wait = (t: number) => new Promise((ok) => setTimeout(ok, t));
const runUntil = 1000;
let counter = 0;
const font = new Font(
  'spleen-5x8.bdf',
  `${process.cwd()}/../Hud/fonts/spleen-5x8.bdf`
);
const titleFont = new Font(
  'spleen-8x16.bdf',
  `${process.cwd()}/../Hud/fonts/spleen-8x16.bdf`
);

/*

BVG Daten
https://v6.bvg.transport.rest/getting-started.html

{
    "type": "stop",
    "id": "900141506",
    "name": "Am Steinberg (Berlin)",
    "location": {
      "type": "location",
      "id": "900141506",
      "latitude": 52.558346,
      "longitude": 13.433255
    },
    "products": {
      "suburban": false,
      "subway": false,
      "tram": true,
      "bus": true,
      "ferry": false,
      "express": false,
      "regional": false
    },
    "stationDHID": "de:11000:900141506"
  },


   {
    "type": "stop",
    "id": "900140017",
    "name": "Gustav-Adolf-Str./Langhansstr. (Berlin)",
    "location": {
      "type": "location",
      "id": "900140017",
      "latitude": 52.553609,
      "longitude": 13.434729
    },
    "products": {
      "suburban": false,
      "subway": false,
      "tram": true,
      "bus": true,
      "ferry": false,
      "express": false,
      "regional": false
    },
    "stationDHID": "de:11000:900140017"
  },

{
      "tripId": "1|42311|28|86|8062023",
      "stop": {
        "type": "stop",
        "id": "900141506",
        "name": "Am Steinberg (Berlin)",
        "location": {
          "type": "location",
          "id": "900141506",
          "latitude": 52.558346,
          "longitude": 13.433255
        },
        "products": {
          "suburban": false,
          "subway": false,
          "tram": true,
          "bus": true,
          "ferry": false,
          "express": false,
          "regional": false
        },
        "stationDHID": "de:11000:900141506"
      },
      "when": "2023-06-08T15:33:00+02:00",
      "plannedWhen": "2023-06-08T15:33:00+02:00",
      "delay": 0,
      "platform": null,
      "plannedPlatform": null,
      "prognosisType": "calculated",
      "direction": "S+U Alexanderplatz",
      "provenance": null,
      "line": {
        "type": "line",
        "id": "m2",
        "fahrtNr": "7159",
        "name": "M2",
        "public": true,
        "adminCode": "BVT---",
        "productName": "Tram",
        "mode": "train",
        "product": "tram",
        "operator": {
          "type": "operator",
          "id": "berliner-verkehrsbetriebe",
          "name": "Berliner Verkehrsbetriebe"
        }
      },
      "remarks": [
        {
          "type": "hint",
          "code": "FK",
          "text": "Bicycle conveyance"
        }
      ],
      "origin": null,
      "destination": {
        "type": "stop",
        "id": "900100024",
        "name": "S+U Alexanderplatz Bhf/Dircksenstr. (Berlin)",
        "location": {
          "type": "location",
          "id": "900100024",
          "latitude": 52.521481,
          "longitude": 13.411924
        },
        "products": {
          "suburban": false,
          "subway": false,
          "tram": true,
          "bus": false,
          "ferry": false,
          "express": false,
          "regional": false
        },
        "stationDHID": "de:11000:900100024"
      },
      "occupancy": "low"
    }


*/

/**
 * BVG Data
 */
let BVGData: Array<Object> = [];
function writeBVG(matrix: LedMatrixInstance) {
  BVGData.sort((a: any, b: any) => parseInt(a.min) - parseInt(b.min));
  BVGData = BVGData.slice(0, 7);
  //   console.log(BVGData);
  if (BVGData.length > 0) {
    BVGData.forEach((item: any, i) => {
      //   matrix.drawText(item.dir, 50, 30 + 10 * i); // write tram infos
      const lines = LayoutUtils.textToLines(
        font,
        matrix.width() - 50,
        item.dir
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
        matrix.width(),
        matrix.height(),
        HorizontalAlignment.Left,
        VerticalAlignment.Middle
      );

      for (const glyph of glyphs) {
        matrix.drawText(glyph.char, glyph.x + 50, 30 + 10 * i);
      }

      matrix.drawText(item.line, 30, 30 + 10 * i); // write tram infos
      matrix.drawText(item.min, 10, 30 + 10 * i); // write the time
    });
  }
}

function updateBVGData(stations: Array<string>) {
  BVGData = [];
  stations.forEach(async (item) => {
    console.log('Requesting BVG-Data for', item);
    const response = await axios.get(
      `https://v6.bvg.transport.rest/stops/${item}/departures?results=10`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    BVGData.push(
      ...response.data.departures
        .filter((item: any) => item.line.product === 'tram')
        .map((item: any) => {
          const dir = replaceUmlaute(item.destination.name);
          const now = new Date();
          const planned = new Date(item.plannedWhen);
          const min = getMinutes(now, planned) + "'";
          return {
            line: item.line.name,
            dir,
            // plannedWhen: item.plannedWhen,
            min,
          };
        })
    );
    // console.log('BVGData.length:' + BVGData.length);
  });
}

/**
 * Weather Data
 */
let weatherData: any;

function writeWeatherData(matrix: LedMatrixInstance) {
  if (weatherData.current) {
    const text = weatherData.current + ' °C';
    if (weatherData.daily.weathercode) {
      switch (weatherData.daily.weathercode[0]) {
        case 0:
        case 1:
        case 2:
        case 3:
          drawSun(matrix, 8, 8);
          break;
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
        case 95:
        case 96:
        case 99:
          drawCloud(matrix, 8, 8);
          break;
      }
      matrix.drawText(text, 16, 8);
    } else {
      console.log(weatherData);
    }
  }
}

function drawSun(
  matrix: LedMatrixInstance,
  x: number,
  y: number,
  radius: number = 4
) {
  const oldColor = matrix.fgColor();
  const oldBGColor = matrix.bgColor();

  matrix.fgColor(0xf5d742);
  matrix.bgColor(0xf5d742);
  while (radius > 0) {
    matrix.drawCircle(x, y + radius, radius--);
  }
  matrix.fgColor(oldColor);
  matrix.bgColor(oldBGColor);
}

function drawCloud(matrix: LedMatrixInstance, x: number, y: number) {
  const oldColor = matrix.fgColor();
  matrix.fgColor(0x95aaba);
  matrix.drawCircle(x, y, 4);

  matrix.fgColor(oldColor);
}

function roundMinutes(date: Date) {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
  date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

  return date;
}

async function updateWeatherData() {
  const response = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=Europe%2FBerlin`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  weatherData = response.data;
  const slot = weatherData.hourly.time.findIndex((item: string) => {
    if (new Date(item) < roundMinutes(new Date())) {
    } else if (new Date(item) > roundMinutes(new Date())) {
    } else {
      return true;
    }
  });
  console.log(slot);
  weatherData.current = weatherData.hourly.temperature_2m[slot];
  console.log(weatherData);
}

function getMinutes(now: Date, planned: Date) {
  const difference = dayjs(planned).diff(dayjs(now), 'minutes');
  return difference;
}
let counter2 = 0;
let flip: Boolean = false;

(() => {
  try {
    const matrix = new LedMatrix(matrixOptions, runtimeOptions);
    matrix.clear().fgColor(0xffffff).brightness(100);

    updateBVGData(['900140017', '900141506']);
    updateWeatherData();
    const interval = setInterval(() => {
      // get updated data every 30 seconds for BVG
      updateBVGData(['900140017', '900141506']);
    }, 30000);

    const weatherInterval = setInterval(() => {
      updateWeatherData();
    }, 1800000);

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

      if (counter2 == 30) {
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

      writeBVG(matrix);
      writeWeatherData(matrix);
      matrix.sync();
      counter2++;
    }, 1000);

    // const updateBVGInterval = setInterval(() => {
    //   writeBVG(matrix);
    // }, 10000);

    // matrix.afterSync((mat, dt, t) => {

    // writeBVG(matrix);
    // setTimeout(() => matrix.sync(), 1000);
    // });
    // matrix.sync();
  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();

const umlautMap: any = {
  '\u00dc': 'UE',
  '\u00c4': 'AE',
  '\u00d6': 'OE',
  '\u00fc': 'ue',
  '\u00e4': 'ae',
  '\u00f6': 'oe',
  '\u00df': 'ss',
};

function replaceUmlaute(str: string) {
  return str
    .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
      const big = umlautMap[a.slice(0, 1)];
      return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
    })
    .replace(
      new RegExp('[' + Object.keys(umlautMap).join('|') + ']', 'g'),
      (a) => umlautMap[a]
    );
}
