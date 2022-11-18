import { useEffect, useState } from "react";
import { DigicreEvent } from "../../interfaces/event";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";
import { useErrorState } from "../useErrorState";

type UseEventList = () => {
  isLoading: boolean;
  events: DigicreEvent[];
};

export const useEventList: UseEventList = () => {
  const [events, setEvents] = useState<DigicreEvent[]>();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  useEffect(() => {
    if (authState.isLoading || !authState.isLogined) return;
    const getData = async () => {
      try {
        const res = await axios.get("/event", {
          headers: {
            Authorization: "Bearer " + authState.token,
          },
        });
        const eventRes: DigicreEvent[] = res.data.event;
        setEvents(eventRes);
        removeError("eventlist-get-fail");
      } catch (err) {
        console.log(err);
        setNewError({ name: "eventlist-get-fail", message: "イベント一覧の取得に失敗しました" });
      }
    };
    getData();
  }, [authState]);
  return {
    isLoading: !events,
    events: events,
  };
};
