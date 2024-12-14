
import axios from "axios";
import { icsCalendarToObject, type VCalendar, type VEvent } from "ts-ics";
import { Font } from 'rpi-led-matrix';
import { LedMatrixInstance } from 'rpi-led-matrix';
import { drawTextLineHelper } from '../utils';


export class Calendar {
    
    private calendar: any;
    private eventsToShow: VEvent[] = [];
    private font = new Font(
        'spleen-5x8.bdf',
        `${process.cwd()}/../Hud/fonts/spleen-5x8.bdf`
      );

    constructor(calendar_url:string) {
        //read ics
        if (!calendar_url) {
            console.log("No Webcal URL set.")
            return;
        }
        
        this.initEverything(calendar_url)

        setInterval(()=>{
            console.log("Updating Calender");
            this.createCalendar(calendar_url)
            this.eventsToShow = this.pickNextEvents(4);
        }, 600000)
    }

    initEverything = async (calendarUrl:string)=>{
        this.calendar = await this.createCalendar(calendarUrl);
        this.eventsToShow = this.pickNextEvents(4);

    }
    createCalendar = async (calendarUrl:string):Promise<VCalendar> => {
        const calendarString = await axios.get(calendarUrl)
        let c = icsCalendarToObject(calendarString.data);
        c.events?.sort((a: VEvent, b: VEvent) => {
            return +new Date(a.start.date) - +new Date(b.start.date);
        });
        
        console.log("Events: ", c.events?.length)
        
        return c
    }

    pickNextEvents(amount:number):VEvent[] {
        let events:VEvent[] = []
        const now = new Date().getTime()
        let counter = 0;
        events = this.calendar.events.filter((event:VEvent)=>{
            if(counter < amount && event.start.date.getTime() > now){
                counter ++;
                return event
            }
        })

        events.map((e:VEvent)=>{
            console.log("Text", e.summary)
            console.log("Datum", e.start.date.toLocaleString("de-DE"))
        })
        return events;
    }

    writeToDisplay(matrix: LedMatrixInstance) {
        matrix.font(this.font);
        const oldColor = matrix.fgColor();
        matrix.fgColor(0xffffff);
    
        const zeile1Offset = 30;
        const zeile2Offset = 40;
        
        if (this.eventsToShow.length > 0) {
            this.eventsToShow.forEach((e: VEvent, i) => {
                const dateString:string = e.start.date.toLocaleString("de-DE") || '';
                matrix.fgColor(0xa36b4d);
                drawTextLineHelper(dateString, 10, zeile1Offset + (i * 22), matrix, this.font, false); // write direction
                matrix.fgColor(0xffffff);
                drawTextLineHelper(e.summary,  10, zeile2Offset + (i * 22), matrix, this.font, false); // write direction
          });
        }
        matrix.fgColor(oldColor);
      }
    
}

//const cal = new Calendar();