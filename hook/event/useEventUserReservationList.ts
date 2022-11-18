import { useEffect, useState } from "react";
import { DigicreEventUserReservation } from "../../interfaces/event";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";

type UseEventUserReservation = (
  eventId: string,
  reservationId: string,
) => {
  isLoading: boolean;
  userReservations: DigicreEventUserReservation[];
};

const useEventUserReservationList: UseEventUserReservation = (eventId, reservationId) => {
  const [userReservations, setUserReservations] = useState<DigicreEventUserReservation[]>();
  const { authState } = useAuthState();
  useEffect(() => {
    if (!authState) return;
    const getFunc = async () => {
      try {
        const res = await axios.get(`/event/${eventId}/${reservationId}`, {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        const userReservationRes: DigicreEventUserReservation[] = res.data.user;
        setUserReservations(userReservationRes);
      } catch (err) {
        console.log(err);
      }
    };
    getFunc();
  }, [authState]);
  return {
    isLoading: !userReservations,
    userReservations: userReservations,
  };
};

export default useEventUserReservationList;
