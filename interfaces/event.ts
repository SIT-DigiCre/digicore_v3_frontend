export type EventListAPIData = {
  events: DigicreEvent[];
  error: string;
};
type DigicreEventBase = {
  id?: string;
  name: string;
  description: string;
  reservated: boolean;
};
export type DigicreEvent = DigicreEventBase & {
  reservable: boolean;
};
export type DigicreEventReservationFrame = {
  id?: string;
  name: string;
  description: string;
  start_date: Date;
  finish_date: Date;
  reservation_start_date: Date;
  reservation_finish_date: Date;
  capacity: number;
  free_capacity: number;
  reservable: boolean;
  reservated: boolean;
};
export type DigicreEventUserReservation = {
  id?: string;
  name?: string;
  comment: string;
  url: string;
};
export type DigicreEventUserReservationUsersAPIData = {
  reservation_users: DigicreEventUserReservation[];
  error: string;
};
export type DigicreEventDetail = DigicreEventBase & {
  reservation_frames: DigicreEventReservationFrame[];
};
