export interface Service {
  name: string;
  pid?: number;
  run(): boolean;
  kill(): boolean;
}
