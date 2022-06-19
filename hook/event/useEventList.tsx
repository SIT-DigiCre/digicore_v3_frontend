import { useEffect, useState } from "react";
import { DigicreEvent } from "../../interfaces/event";
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
      const res = await axios.get("", {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      });
      const eventsTmp: DigicreEvent = res.data;
    };
    getData();
  }, []);
  return {
    isLoading: !events,
    events: events,
  };
};
