type DigicreEventBase = {
  eventId?: string;
  name: string;
  description: string;
  reservated: boolean;
  calenderView: boolean;
};
export type DigicreEvent = DigicreEventBase & {
  reservable: boolean;
};
export type DigicreEventReservation = {
  reservationId?: string;
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  reservationStartDate: string;
  reservationFinishDate: string;
  capacity: number;
  freeCapacity: number;
  reservable: boolean;
  reservated: boolean;
  users: DigicreEventUserReservation[];
};
export type DigicreEventDetail = DigicreEvent & {
  reservations: DigicreEventReservation[];
};

export type DigicreEventUserReservation = {
  userId: string;
  userIcon: string;
  name: string;
  comment: string;
  url: string;
};
