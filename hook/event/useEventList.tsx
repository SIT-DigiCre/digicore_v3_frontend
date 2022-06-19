import { useEffect, useState } from "react";
import { DigicreEvent, EventListAPIData } from "../../interfaces/event";
import { axios } from "../../utils/axios";
import { useAuthState } from "../useAuthState";

type UseEventList = () => {
  isLoading: boolean;
  events: DigicreEvent[];
};

export const useEventList: UseEventList = () => {
  const [events, setEvents] = useState<DigicreEvent[]>();
  const { authState } = useAuthState();
  useEffect(() => {
    if (authState.isLoading || !authState.isLogined) return;
    const getData = async () => {
      try {
        const res = await axios.get("/event", {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        });
        const eventRes: EventListAPIData = res.data;
        setEvents(eventRes.event);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [authState]);
  return {
    isLoading: !events,
    events: events,
  };
};
