export const baseURL =
  process.env.NODE_ENV === "production" ? "https://coreapi3.digicre.net" : "http://localhost:8000";
export const baseURLForServerSide =
  process.env.NODE_ENV === "production" ? "http://digicoreapi_v3:8000" : "http://localhost:8000";

const objectSort = (obj) => {
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
