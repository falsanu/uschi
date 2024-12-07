import {
  GpioMapping,
  LedMatrix,
  // LedMatrixUtils,
  MatrixOptions,
  RuntimeFlag,
  // PixelMapperType,
  RuntimeOptions,
} from 'rpi-led-matrix';

export const matrixOptions: MatrixOptions = {
  ...LedMatrix.defaultMatrixOptions(),
  rows: 64,
  cols: 64,
  chainLength: 3,
  hardwareMapping: GpioMapping.Regular,
  // disableHardwarePulsing: false,
  parallel: 2,
  panelType: 'FM6126A',
  limitRefreshRateHz: 100,
  showRefreshRate: false,

  // pixelMapperConfig: LedMatrixUtils.encodeMappers(
  //   { type: PixelMapperType.Chainlink }
  // ),
  // pixelMapperConfig: LedMatrixUtils.encodeMappers({ type: PixelMapperType.U }),
};

// console.log('matrix options: ', JSON.stringify(matrixOptions, null, 2));

export const runtimeOptions: RuntimeOptions = {
  ...LedMatrix.defaultRuntimeOptions(),
  gpioSlowdown: 4,
  dropPrivileges: RuntimeFlag.Off,
};

console.log('runtime options: ', JSON.stringify(runtimeOptions, null, 2));
