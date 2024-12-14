
import axios from "axios";
import { Font } from 'rpi-led-matrix';
import { LedMatrixInstance } from 'rpi-led-matrix';
import { replaceUmlaute, drawTextLineHelper } from '../utils';


type GroupData = {
    "groupName": string
    "groupOrderID": number,
    "groupID": number
}

type Team = {
    "teamId": number,
    "teamName": string,
    "shortName": string,
    "teamIconUrl": string,
    "teamGroupName": string
}

type MatchResult = {
    "resultID": number,
    "resultName": string, //"Halbzeit"
    "pointsTeam1": number, // Tore team1
    "pointsTeam2": number, // Tore team2
    "resultOrderID": number,
    "resultTypeID": number,
    "resultDescription": string //"Ergebnis nach Ende der ersten Halbzeit"
}

type Goal = {
    "goalID": number,
    "scoreTeam1": number,
    "scoreTeam2": number,
    "matchMinute": number,
    "goalGetterID": number,
    "goalGetterName": string,
    "isPenalty": boolean,
    "isOwnGoal": boolean,
    "isOvertime": boolean,
    "comment": string
}

type MatchData = {
    "matchID": number,
    "matchDateTime": string,
    "timeZoneID": string,
    "leagueId": number,
    "leagueName": string,
    "leagueSeason": number,
    "leagueShortcut": string,
    "matchDateTimeUTC": string,
    "group": GroupData
    "team1": Team,
    "team2": Team,
    "lastUpdateDateTime": string,
    "matchIsFinished": boolean,
    "matchResults": MatchResult[],
    "goals": Goal[],
    "location": any,
    "numberOfViewers": any
}



export class Soccer {

    private leagueShortcut: string = '';
    private matchDay: MatchData[] = [];
    private hasAPIError: boolean = false;
    private leagueName: string = '';
    private smallFont = new Font(
        '4x6.bdf',
        `${process.cwd()}/../HudSchool/fonts/4x6.bdf`
    );

    private font = new Font(
        'spleen-5x8.bdf',
        `${process.cwd()}/../HudSchool/fonts/spleen-5x8.bdf`
    );

    constructor(leagueShortCut: string) {

        if (!leagueShortCut) {
            console.log("No League given, exiting.")
            return;
        }

        this.leagueShortcut = leagueShortCut;

        this.initEverything();

        setInterval(() => {
            console.log("Updating Soccer Data");
            this.updateData();
        }, 600000)
    }

    initEverything = async () => {
        await this.updateData()
    }

    async updateData() {
        console.log("updating data");
        try {
            const res = await axios.get(`https://api.openligadb.de/getmatchdata/${this.leagueShortcut}/0/0`);
            console.log("Read Matchday Data:", res.data.length)
            this.matchDay = res.data;
            this.leagueName = replaceUmlaute(this.matchDay[0].leagueName)
            this.hasAPIError = false;
        } catch (error) {
            this.hasAPIError = true;
            console.log("Error catching Data")
        }

    }

    writeToDisplay(matrix: LedMatrixInstance, x: number = 0, y: number = 0, width: number = 184, height: number = 0) {

        
        const oldColor = matrix.fgColor();
        matrix.font(this.font);
        matrix.fgColor(0xc12a22);

        if (width === 0) {
            width = matrix.width();
        }
        if (height === 0) {
            height = matrix.height();
        }

        // NAME
        const nameWidth = this.font.stringWidth(this.leagueName);
        const nameHeight = this.font.height() + 5;

        drawTextLineHelper(this.leagueName, x , y, matrix, this.font)

        let BoxHeight = Math.floor((height - (y + nameHeight)) / this.matchDay.length);

        y = y + nameHeight + 1;
        const inity = y;
        const initx = x;


        matrix.font(this.smallFont);
        const textHeight = this.smallFont.height();
        matrix.fgColor(0x075078);

        this.matchDay.map((match: MatchData, matchIndex: number) => { // y-value

            // write game
            const x0 = x;
            const y0 = (matchIndex * BoxHeight) + y;

            let team1Goals = " - :";
            
            if (match.goals.length > 0 && match.goals[match.goals.length-1].scoreTeam1) {
                team1Goals = ` ${match.goals[match.goals.length-1].scoreTeam1} :`
            }

            let goalWidth = this.smallFont.stringWidth(team1Goals)
            const goalX = matrix.width() / 2 - goalWidth;
            const goalY = y0;

            matrix.drawText(team1Goals, goalX, goalY);


            const team1Name = match.team1.shortName.length > 0 ? match.team1.shortName : match.team1.teamName

            const matchString: string = team1Name.trim();
            const textWidth = this.smallFont.stringWidth(matchString);

            const textX = matrix.width() / 2 - textWidth - goalWidth;
            const textY = y0

            matrix.drawText(matchString, textX, textY);

        })
        x = initx;
        y = inity;
        this.matchDay.map((match: MatchData, matchIndex: number) => { // y-value

            // write game
            const x0 = x + (matrix.width() / 2);
            const y0 = (matchIndex * BoxHeight) + y;

            let team2Goals = " -";
            if (match.goals.length > 0 && match.goals[match.goals.length-1].scoreTeam2) {
                team2Goals = ` ${match.goals[match.goals.length-1].scoreTeam2}`
            }

            let goalWidth = this.smallFont.stringWidth(team2Goals)
            const goalX = matrix.width() / 2;
            const goalY = y0;

            matrix.drawText(team2Goals, goalX, goalY);

            const team2Name = match.team2.shortName.length > 0 ? match.team2.shortName : match.team2.teamName

            const matchString: string = team2Name.trim()
            const textX = x0 + goalWidth
            const textY = y0

            matrix.drawText(matchString, textX, textY);

        })
        matrix.fgColor(0xffffff);
        
        matrix.fgColor(oldColor);
        
    }

}
