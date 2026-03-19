import type { components } from "@/utils/fetch/api.d.ts";

export const ACTIVITY_PLACES: Record<string, string> = {
  "omiya-bushitsu": "大宮部室",
};

export const DEFAULT_PLACE = "omiya-bushitsu";

export type ActivityCurrentUser =
  components["schemas"]["ResGetActivityPlacePlaceCurrentObjectUser"];

export type ActivityHistoryUser =
  components["schemas"]["ResGetActivityPlacePlaceHistoryObjectUser"];

export type ActivityRecord = components["schemas"]["ResGetActivityUserUserIdRecordsObjectRecord"];
