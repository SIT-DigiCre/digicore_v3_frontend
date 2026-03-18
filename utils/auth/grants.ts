const CLAIM_PREFIX = "CLAIM_";

const toGrant = (claim: string): string => `${CLAIM_PREFIX}${claim}`;

export const GRANT_INFRA = toGrant("infra");
export const GRANT_ACCOUNT = toGrant("account");

export const normalizeGrants = (grants: string[]): string[] =>
  Array.from(new Set(grants.map((grant) => grant.trim()).filter((grant) => grant !== "")));

export const hasGrant = (grants: string[], requiredGrant: string): boolean =>
  grants.includes(requiredGrant);

export const hasAnyGrant = (grants: string[], requiredGrants: string[]): boolean =>
  requiredGrants.some((grant) => hasGrant(grants, grant));
