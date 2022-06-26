export type EventListAPIData = {
  events: DigicreEvent[];
  error: string;
};
export type DigicreEvent = {
  id?: string;
  name: string;
  description: string;
  reservable: boolean;
  reservated: boolean;
};
export type DigicreEventDetail = DigicreEvent & {
  full: boolean;
  reservated: boolean;
};
