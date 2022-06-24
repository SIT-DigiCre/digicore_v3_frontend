import { useState } from "react";
import { DigicreEvent, DigicreEventDetail } from "../../interfaces/event";

type UseEventDetail = (id: string) => {
  isLoading: boolean;
  notFound: boolean;
  eventDetail: DigicreEventDetail;
};
const useEventDetail = () => {
  const [eventDetail, setEventDetail] = useState();
};

export default useEventDetail;
