import { useEffect, useState } from "react";
import {
  DigicreEventUserReservation,
  DigicreEventUserReservationUsersAPIData,
} from "../../interfaces/event";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";

type UseEventUserReservation = (
  eventId: string,
  frameId: string,
) => {
  isLoading: boolean;
  userReservations: DigicreEventUserReservation[];
};

const useEventUserReservationList: UseEventUserReservation = (eventId, frameId) => {
  const [userReservations, setUserReservations] = useState<DigicreEventUserReservation[]>();
  const { authState } = useAuthState();
  useEffect(() => {
    if (!authState) return;
    const getFunc = async () => {
      try {
        const res = await axios.get(`/event/${eventId}/${frameId}`, {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        });
        const deuru: DigicreEventUserReservationUsersAPIData = res.data;
        setUserReservations(deuru.reservation_users);
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
