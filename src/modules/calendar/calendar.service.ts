import {Injectable} from "@nestjs/common";

@Injectable()
export class WeeklyService {
    constructor() {}

    // google 캘린더
    private readonly calendar = google.calendar("v3");

    async getEvents(accessToken: string, calendarId: string, start: Date, end: Date) {
        const auth = new OAuth2Client();
        auth.setCredentials({ access_token: accessToken });

        // const events = await this.calendar.events;
        const events = await this.calendar.events.list({
            auth,
            calendarId,
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            singleEvents: true,
            orderBy: "startTime",
        });
        return events.data.items;
    }
}