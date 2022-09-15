export interface AuditTrailInterface {
  recordID?: string;
  recordType: string;
  partnerUUID?: string;
  profileId?: string;
  eventId?: string;
  whitelistId?: string;
  fieldsUpdated: string;
  createdAt?: string;
  updatedAt?: string;
}
