export interface FA {
  count: number;
  general?: {
    name: string;
    type: string;
  };
  equipments: { _id: string; name: string; required: number }[];
  timeframes: { start: Date; end: Date }[];
  validated: String[];
  comments: [];
}
