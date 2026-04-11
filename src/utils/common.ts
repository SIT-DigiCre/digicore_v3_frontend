const defaultBaseURL = "http://localhost:8000";
const defaultBaseURLForServerSide = "http://localhost:8000";

const productionBaseURL = "https://coreapi3.digicre.net";
const productionBaseURLForServerSide = "http://digicoreapi_v3:8000";

const isProduction = process.env.NODE_ENV === "production";

export const baseURL = isProduction
  ? productionBaseURL
  : process.env.NEXT_PUBLIC_BASE_URL ?? defaultBaseURL;
export const baseURLForServerSide = isProduction
  ? productionBaseURLForServerSide
  : process.env.BASE_URL_FOR_SERVER_SIDE ?? defaultBaseURLForServerSide;

const objectSort = (obj: unknown): unknown => {
  if (!obj) return obj;
  const sorted = Object.entries(obj).sort();
  for (const i in sorted) {
    const val = sorted[i][1];
    if (typeof val === "object") {
      sorted[i][1] = objectSort(val);
    }
  }
  return sorted;
};
export const objectEquals = (a: unknown, b: unknown): boolean => {
  const aJSON = JSON.stringify(objectSort(a));
  const bJSON = JSON.stringify(objectSort(b));
  return aJSON === bJSON;
};
