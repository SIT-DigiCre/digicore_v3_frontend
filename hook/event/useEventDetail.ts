import { useEffect, useState } from "react";
import { DigicreEvent, DigicreEventDetail } from "../../interfaces/event";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";

type UseEventDetail = (id: string) => {
  isLoading: boolean;
  notFound: boolean;
  eventDetail: DigicreEventDetail;
  reservation: (id: string, commentText: string, urlText: string) => Promise<boolean>;
  cancelReservation: (id: string) => Promise<boolean>;
};
const useEventDetail: UseEventDetail = (id) => {
  const [eventDetail, setEventDetail] = useState<DigicreEventDetail>();
  const [eventNotFound, setEventNotFound] = useState(false);
  const { authState } = useAuthState();
  useEffect(() => {
    const getFunc = async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/event/${id}`, {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        });

        const ed: DigicreEventDetail = res.data;
        setEventDetail(ed);
      } catch (err: any) {
        const msg: string = err.message;
        if (msg.indexOf("404") !== -1) setEventNotFound(true);
      }
    };
    getFunc();
  }, [authState]);

  const reservation = async (frameId: string, commentText: string, urlText: string) => {
    const res = await axios.post(
      `/event/${id}/${frameId}`,
      {
        comment: commentText,
        url: urlText,
      },
      {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      },
    );
    return true;
  };
  const cancelReservation = async (frameId: string) => {
    const res = await axios.delete(`/event/${id}/${frameId}`, {
      headers: {
        Authorization: "bearer " + authState.token,
      },
    });
    return true;
  };

  return {
    isLoading: !eventDetail,
    notFound: eventNotFound,
    eventDetail: eventDetail,
    reservation: reservation,
    cancelReservation: cancelReservation,
  };
};

export default useEventDetail;
