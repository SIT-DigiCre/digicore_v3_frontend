const CLAIM_PREFIX = "CLAIM_";

const toGrant = (claim: string): string => `${CLAIM_PREFIX}${claim}`;

export const GRANT_BUDGET_ADMIN = toGrant("budget_admin");
export const GRANT_PAYMENT_ADMIN = toGrant("payment_admin");
export const GRANT_GROUP_ADMIN = toGrant("group_admin");
export const GRANT_FORCE_CHECKOUT = toGrant("force_checkout");
export const GRANT_ACTIVITY_RECORD_EDIT_OTHER = toGrant("activity_record_edit_other");
export const GRANT_MAIL_BROADCAST = toGrant("mail_broadcast");

export const normalizeGrants = (grants: string[]): string[] =>
  Array.from(new Set(grants.map((grant) => grant.trim()).filter((grant) => grant !== "")));

export const hasGrant = (grants: string[], requiredGrant: string): boolean =>
  grants.includes(requiredGrant);

export const hasAnyGrant = (grants: string[], requiredGrants: string[]): boolean =>
  requiredGrants.some((grant) => hasGrant(grants, grant));
