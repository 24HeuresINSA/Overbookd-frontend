export interface IUser {
    firstname: string;
    lastname: string;
    _id: string;
    assigned?: ITimeframe[];
}

interface ITimeframe {
    name: string;
    FTID?: string;
    start: Date;
    end: Date;
}

