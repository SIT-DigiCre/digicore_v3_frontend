export type EventListAPIData = {
  event: DigicreEvent[];
  error: string;
};
export type DigicreEvent = {
  id?: string;
  name: string;
  description: string;
  reservated: boolean;
};
export type DigicreEventDetail = DigicreEvent & {
  full: boolean;
  reservated: boolean;
};
