export type DigicreEvent = {
  eventId: string;
  name: string;
  description: string;
  reservable: boolean;
  reservated: boolean;
};

type DigicreEventUserReservation = {
  userId: string;
  userIcon: string;
  name: string;
  comment: string;
  url: string;
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
