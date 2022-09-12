import { WHITELISTEDCURRENCY, WHITELISTEDSTATUS } from "types/types";

export interface WhitelistInterface {
  profileId: string;
  address: string;
  name: string;
  status: WHITELISTEDSTATUS;
  currency: WHITELISTEDCURRENCY;
}
