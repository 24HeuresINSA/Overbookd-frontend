export interface IFA {
  count: number;
  general?: {
    name: string;
    type: string;
  };
}

export class FA implements IFA {
  count = 0;
  general: undefined;
}
