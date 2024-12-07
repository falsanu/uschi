import * as color from 'color';
import { LedMatrixInstance, LedMatrix } from 'rpi-led-matrix';
import { matrixOptions, runtimeOptions } from './config/_config';
// const wait = (t: number) => new Promise(ok => setTimeout(ok, t));
import { Vector } from 'vecti';
const runUntil = 1000;
let counter = 0;

class Bubble {
  private pos: Vector;
  private vel: Vector;
  private acc: Vector;
  private newTarget: Vector;
  private mW: number;
  private mH: number;
  private m: LedMatrixInstance;
  private color: number;
  constructor(
    x: number,
    y: number,
    mW: number,
    mH: number,
    m: LedMatrixInstance
  ) {
    this.mW = mW;
    this.mH = mH;
    this.m = m;
    this.pos = new Vector(x, y);
    this.acc = new Vector(0, 0);
    this.vel = new Vector(Math.random(), Math.random());
    this.vel.multiply(Math.random() * 3);
    this.newTarget = new Vector(Math.random() * mW, Math.random() * mH);
    this.color = color.hsl(Math.random() * 255, 100, 50).rgbNumber();

    setTimeout(() => {
      setInterval(() => {
        this.createNewTarget();
      }, 1000);
    }, Math.random() * 1000);
  }

  createNewTarget() {
    this.newTarget = new Vector(
      Math.random() * this.mW,
      Math.random() * this.mH
    );
    //console.log(this.newTarget)
  }

  update() {
    this.acc = this.newTarget.subtract(this.pos);
    const x: Vector = this.acc.normalize();
    this.acc = x.multiply(0.1);

    this.vel = this.vel.add(this.acc);

    this.vel = setLimit(2, this.vel);

    this.pos = this.pos.add(this.vel);
  }

  draw() {
    this.m.fgColor(this.color);
    // this.m.drawCircle(this.pos.x, this.pos.y, 1);
    this.m.setPixel(this.pos.x, this.pos.y);
  }
}
function magSq(v: Vector): number {
  return v.x * v.x + v.y * v.y;
}
function setLimit(max: number, v: Vector): Vector {
  const mSq = magSq(v);

  if (mSq > max * max) {
    v = v.divide(Math.sqrt(mSq));
    v = v.multiply(max); //normalize it
  }
  return v;
}

(() => {
  try {
    const matrix = new LedMatrix(matrixOptions, runtimeOptions);
    const width = matrix.width();
    const height = matrix.height();
    const bubbles: Array<Bubble> = [];
    for (let i = 0; i < 10; i++) {
      bubbles.push(
        new Bubble(
          Math.random() * width,
          Math.random() * height,
          width,
          height,
          matrix
        )
      );
    }
    console.log('available pixel mappers: ', matrix.getAvailablePixelMappers());
    console.log(`current mapper config: ${matrixOptions.pixelMapperConfig}`);
    console.log('height: ', matrix.height());
    console.log('width: ', matrix.width());
    matrix.clear().fgColor(0xffffff).brightness(100);

    function resetMatrix() {
      matrix.clear().fgColor(0xffffff).brightness(100);
      for (let i = 0; i < matrix.width(); i += 10) {
        for (let j = 0; j < matrix.height(); j += 10) {
          matrix.setPixel(i, j);
        }
      }
    }
    resetMatrix();
    matrix.afterSync((mat, dt, t) => {
      counter++;
      if (counter > runUntil) {
        counter = 0;
        resetMatrix();
      }
      bubbles.forEach((item) => {
        item.update();
        item.draw();
      });

      setTimeout(() => matrix.sync(), 20);
    });
    matrix.sync();
  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();
