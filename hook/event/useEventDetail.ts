import { useEffect, useState } from "react";

import { DigicreEventDetail } from "../../interfaces/event";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

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
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    const getFunc = async () => {
      if (!authState.isLogined) return;
      try {
        const res = await axios.get(`/event/${id}`, {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });

        const ed: DigicreEventDetail = res.data;
        setEventDetail(ed);
        removeError("eventdetail-get-fail");
      } catch (err) {
        const msg: string = err.message;
        if (msg.indexOf("404") !== -1) setEventNotFound(true);
        setNewError({ name: "eventdetail-get-fail", message: "イベント詳細の取得に失敗しました" });
      }
    };
    getFunc();
  }, [authState]);

  const reservation = async (frameId: string, commentText: string, urlText: string) => {
    try {
      await axios.put(
        `/event/${id}/${frameId}/me`,
        {
          comment: commentText,
          url: urlText,
        },
        {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        },
      );
      removeError("eventdetailreservation-post-fail");
    } catch {
      setNewError({
        name: "eventdetailreservation-post-fail",
        message: "イベント枠予約に失敗しました",
      });
    }
    return true;
  };
  const cancelReservation = async (frameId: string) => {
    try {
      await axios.delete(`/event/${id}/${frameId}/me`, {
        headers: {
          Authorization: "Bearer " + authState.token,
        },
      });
      removeError("eventdetailreservation-delete-fail");
    } catch {
      setNewError({
        name: "eventdetailreservation-delete-fail",
        message: "イベント枠予約キャンセルに失敗しました",
      });
    }
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
