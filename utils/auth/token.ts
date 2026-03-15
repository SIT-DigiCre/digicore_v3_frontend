export const getTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;

  const jwtCookie = document.cookie.split("; ").find((row) => row.startsWith("jwt="));
  return jwtCookie ? jwtCookie.replace(/^jwt=/, "") : null;
};
