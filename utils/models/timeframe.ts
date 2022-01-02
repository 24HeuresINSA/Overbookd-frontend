export interface Timeframe {
  start: Date;
  end: Date;
}

export interface Timeslot {
  _id: string;
  groupTitle: string;
  groupDescription: string;
  charisma: number;
  timeFrame: Timeframe;
}
