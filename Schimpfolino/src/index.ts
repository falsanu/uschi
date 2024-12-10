import { LedMatrix, LedMatrixInstance, Font } from 'rpi-led-matrix';
import * as fs from 'fs';
import * as path from 'path';
import { drawTextLineHelper } from './utils';

import { matrixOptions, runtimeOptions } from './config/_config';

// import dotenv from 'dotenv';
// dotenv.config();

const font = new Font(
  'spleen-5x8.bdf',
  `${process.cwd()}/../Schimpfolino/fonts/spleen-5x8.bdf`
);
const titleFont = new Font(
  'spleen-8x16.bdf',
  `${process.cwd()}/../Schimpfolino/fonts/spleen-8x16.bdf`
);

const swearFont = new Font(
  'spleen-6x12.bdf',
  `${process.cwd()}/../Schimpfolino/fonts/spleen-6x12.bdf`
);
let counter2 = 0;
let flip: Boolean = false;

// load data in variables
function loadTextFilesFromDirectory(directoryPath: string): Record<string, string[]> {
    // Überprüfen, ob der Pfad existiert
    if (!fs.existsSync(directoryPath)) {
        throw new Error(`Das Verzeichnis "${directoryPath}" existiert nicht.`);
    }

    // Array für die Inhalte der Textdateien
    const textFileContents:  Record<string, string[]> = {};

    // Alle Dateien und Verzeichnisse im angegebenen Verzeichnis auflisten
    const files = fs.readdirSync(directoryPath);

    // Jede Datei prüfen
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);

        // Überprüfen, ob es sich um eine Datei handelt
        if (fs.statSync(filePath).isFile() && file.endsWith('.txt')) {
            // Textinhalt der Datei lesen und speichern
            const content = fs.readFileSync(filePath, 'utf-8');
            const words = content
            .split(/\s+/) // Trenne bei einem oder mehreren Leerzeichen
            .filter(word => word.length > 1)
            .map(word=>{return replaceSpecialCharacters(word)}); // Filtere Wörter mit einer Länge von weniger als 2 Zeichen heraus
            const fileNameWithoutExtension = path.parse(file).name;

            textFileContents[fileNameWithoutExtension] = words
        }
    });

    return textFileContents;
}
let textFiles:any = {}
// Beispielverwendung
try {
  console.log('Aktuelles Arbeitsverzeichnis:', process.cwd());
  console.log('Aktuelles Verzeichnis:', __dirname);

  const directoryPath = __dirname+'/dictionary'; 
  textFiles = loadTextFilesFromDirectory(directoryPath);

} catch (error) {
  console.error('Fehler:', error);
}

function getRandomElement<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length); // Zufallsindex berechnen
  return array[randomIndex]; // Element an diesem Index zurückgeben
}
function replaceSpecialCharacters(input: string): string {
  return input
      .replace(/#/g, "ae")
      .replace(/\$/g, "oe")
      .replace(/%/g, "ue")
      .replace(/&/g, "AE")
      .replace(/'/g, "OE")
      .replace(/'/g, "UE") // Der zweite Fall von "'" ist redundant, da beide gleiche Zeichen betreffen.
      .replace(/\*/g, "ss");
}
const generateSwear = ()=>{
  
  let first:string = getRandomElement(textFiles.eeprom1)
  let genus =Math.floor(Math.random() * 3);
  
  if (genus != 0) {      // 0 femininum
    if (genus == 1){ // 1 maskulinum
      first+="r"
    }else{
      first+="s"  // 2 Neutrum
    }
  } 

  let second:string = getRandomElement(textFiles.eeprom2)
  switch (genus) {
    case 0: second += getRandomElement(textFiles.eeprom3); break;
    case 1: second += getRandomElement(textFiles.eeprom4); break;
    case 2: second += getRandomElement(textFiles.eeprom5); break;
  }
  
  return {first, second};
}
try{
  console.log(generateSwear())
}catch(e){
  console.log(e)
}

let swear = {first:"", second:""};
const swearToUschi = () => {
  swear = generateSwear()
  console.log("Swear", swear);
}

const writeSwear = (matrix: LedMatrixInstance) => {

  matrix.font(swearFont);
  const oldColor = matrix.fgColor();
  matrix.fgColor(0xffffff);
  // drawTextLineHelper(swear.first, 10,30, matrix, swearFont, false)
  matrix.drawText(swear.first, 10, 50 );
  matrix.drawText(swear.second, 10, 50 + 15);
  matrix.fgColor(oldColor);


}




(() => {

  try {
    /**
     * Instanciate new Matrix, clear it and set the drawing color to white
     */
    const matrix = new LedMatrix(matrixOptions, runtimeOptions);
    matrix.clear().fgColor(0xffffff).brightness(100);


    /**
     * Instanciate all "Widgets"
     */
    // setInterval(()=>{
      // swearToUschi(matrix)}
      // ,5000
    // );
    swearToUschi();
    setInterval(swearToUschi, 5000);
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

      if (counter2 == 15) {
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

      writeSwear(matrix)

      matrix.sync();
      counter2++;
    }, 1000);
  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();
