import { EventStatus } from "../types/types";

export interface EventsInterface {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  status: EventStatus;
  eventImageBanner: string;
  eventImagePlaque: string;
  eventImageOne: string;
  eventImageTwo: string;
  eventImageThree: string;
  eventDetailsShortDescription: string;
  eventDetailsLongDescription: string;
  partnerUUID: string;
  likes: string;
  address: string;
  address1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  tags: string[];
  napaPerks: string;
  eventRules: string;
  entryFees: string;
  sponsors: string;
  paid: boolean;
  amount: string;
  txid: string;
  createdAt: string;
  updatedAt: string;
}
