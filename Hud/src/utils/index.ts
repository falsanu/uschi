import {
  LedMatrixInstance,
  LayoutUtils,
  FontInstance,
  HorizontalAlignment,
  VerticalAlignment,
} from 'rpi-led-matrix';
import dayjs from 'dayjs';

export const umlautMap: any = {
  '\u00dc': 'UE',
  '\u00c4': 'AE',
  '\u00d6': 'OE',
  '\u00fc': 'ue',
  '\u00e4': 'ae',
  '\u00f6': 'oe',
  '\u00df': 'ss',
};

export function replaceUmlaute(str: string) {
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

export function drawTextLineHelper(
  text: string,
  x: number,
  y: number,
  ledMatrix: LedMatrixInstance,
  font: FontInstance,
  multiLine: Boolean = false
) {
  const lines = LayoutUtils.textToLines(font, ledMatrix.width() - 50, text);
  let line = [];
  if (lines.length > 1) {
    line.push(lines[0]);
  } else {
    line = lines;
  }
  const glyphs = LayoutUtils.linesToMappedGlyphs(
    line,
    font.height(),
    ledMatrix.width(),
    ledMatrix.height(),
    HorizontalAlignment.Left,
    VerticalAlignment.Middle
  );
  for (const glyph of glyphs) {
    ledMatrix.drawText(glyph.char, glyph.x + x, y);
  }
}

export function getMinutes(now: Date, planned: Date) {
  const difference = dayjs(planned).diff(dayjs(now), 'minutes');
  return difference;
}
