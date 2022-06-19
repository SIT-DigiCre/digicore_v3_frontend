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
