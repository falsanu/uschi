
import { Font } from 'rpi-led-matrix';
import { LedMatrixInstance } from 'rpi-led-matrix';
//import { replaceUmlaute, getMinutes, drawTextLineHelper } from '../utils';


export class School { // add Class extend for HUD-Service later

    private kids: any;
    private kid:any;

    private smallFont = new Font(
        '4x6.bdf',
        `${process.cwd()}/../HudSchool/fonts/4x6.bdf`
    );

    private font = new Font(
        'spleen-8x16.bdf',
        `${process.cwd()}/../HudSchool/fonts/spleen-8x16.bdf`
    );

    constructor(kid:any) {
        this.kid = kid;
        // Create Wochenplan pro Kid
        // this.kids = [
        //     {
        //         name: "Helena",
        //         plan: [
        //             //mo,   di,   mi, do, fr
        //             ["-", "Mu", "N", "E", "P"],     // 1.Stunde
        //             ["E", "Sp", "N", "D", "P"],     // 2.Stunde
        //             ["E", "Sp", "Sp", "N", "Ma"],   // 3.Stunde
        //             ["D", "G", "Ma", "N", "Ma"],    // 4.Stunde
        //             ["D", "Ma", "D", "D", "-"],     // 5.Stunde
        //             ["Ma", "E", "Ku", "Mu", "-"],   // 6.Stunde
        //             ["G", "-", "Ku", "G", "-"],     // 7.Stunde
        //         ],
        //         appointments:
        //             ["Mo: Karate, Di: Drums, Mi: Karate"]

        //     },
        //     {
        //         name: "Mathilda",
        //         plan: [
        //             //mo,   di,   mi,   do,   fr
        //             ["De", "MB", "Sa", "De", "Ma"],     // 1.Stunde
        //             ["Ma", "De", "De", "Mu", "De"],     // 2.Stunde
        //             ["Mu", "Ku", "Ma", "De", "VHG"],    // 3.Stunde
        //             ["Lk", "Ku", "VHG", "Ma", "Sa"],    // 4.Stunde
        //             ["-", "Ma", "De", "De", "Sp"],      // 5.Stunde
        //             ["-", "Sp", "Foe", "Sp", "-"],      // 6.Stunde
        //             ["-", "-", "-", "-", "-"],          // 7.Stunde
        //         ],
        //         appointments:
        //             ["Mo: Karate, Di: Drums, Do: Karate"]
        //     }
        // ]
    }


    writeToDisplay(matrix: LedMatrixInstance, x:number = 0, y:number = 0, width:number = 184, height:number = 0) {

        matrix.font(this.font);
        const oldColor = matrix.fgColor();
        matrix.fgColor(0xb60040);

        if (width === 0) {
            width = matrix.width();
        }
        if (height === 0) {
            height = matrix.height();
        }

        // NAME
        const nameWidth = this.font.stringWidth(this.kid.name);
        const nameHeight = this.font.height();
        matrix.drawText(this.kid.name, x + (Math.floor((width-nameWidth) / 2)) , y);

        let boxWidth = Math.floor((width - x) / this.kid.plan[0].length);//38; // calculate later from Matrix-Width (38 works for fullscreen plan)
        let BoxHeight = Math.floor((height - (y + nameHeight)) / this.kid.plan.length); // calculate later from Matrix-Height (14 works for fullscreen plan)
        
        y = y + nameHeight + 1;
        matrix.font(this.smallFont);
        const textHeight = this.smallFont.height();
        // this.kids.map((kid:any)=>{
            // KIND
            this.kid.plan.map((row:string[], hourIndex:number)=>{ // y-value
                row.map((day, dayIndex)=>{
                    // write Day
                    const x0 = (dayIndex * boxWidth) + x;
                    const y0 = (hourIndex * BoxHeight) + y;
                    matrix.fgColor(0x075078);
                    matrix.drawRect(x0, y0, boxWidth, BoxHeight);
                    const textWidth = this.smallFont.stringWidth(day);
                    const textX = x0 + (Math.floor((boxWidth-textWidth) / 2))
                    const textY = y0 + (Math.floor(BoxHeight-textHeight) / 2)
                    matrix.fgColor(0xffffff);
                    matrix.drawText(day, textX, textY);

                })

            })
        // })
        matrix.fgColor(oldColor);
    }

}

// const school = new School();