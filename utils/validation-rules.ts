const userValidationRule = {
  // accountNumber: "required|string",
  profileName: "required|string",
  bio: "string",
  timezone: "string",
  primaryCurrency: "required|string",
  language: "required|string",
  napaSocialMediaAccount: "string",
  avatar: "string",
};

const partnerValidationRule = {
  accountNumber: "required|string",
  profileName: "required|string",
  email: "required|string|email",
  contactPerson: "required|string",
  website: "required|string",
  avatar: "string",
};

const whitelistValidationRule = {
  profileId: "required|string",
  name: "required|string",
  address: "required|string",
  status: "required|string",
  currency: "required|string",
};

const faqValidationRule = {
  question: "string",
  response: "string",
};

const eventsValidationRule = {
  eventTitle: "required|string",
  eventDate: "required|date",
  eventImageBanner: "string",
  eventImageOne: "string",
  eventImageTwo: "string",
  eventImageThree: "string",
  eventDetailsShortDescription: "string",
  eventDetailsLongDescription: "string",
  partnerUUID: "required|string",
  likes: "numeric",
  status: "required|string",
  address: "string",
  address1: "string",
  city: "string",
  state: "string",
  zipCode: "string",
  country: "string",
  tags: "string",
  napaPerks: "string",
  eventRules: "string",
  entryFees: "string",
  sponsors: "string",
  paid: "string",
  amount: "numeric",
  txid: "string",
};

const trendingValidationRules = {
  articleTitle: "required|string",
  articleBody: "string",
  articleHeadline: "string",
  nftProject: "string",
  socialMediaCompaign: "string",
  articleTags: "string",
  articleType: "required|string",
  partnerUUID: "required|string",
  author: "string",
  articleStartDate: "required|string",
  articleEndDate: "required|string",
  postAdInNapaApp: "string",
  totalRunDays: "required|string",
  paid: "string",
  articleStatus: "required|string",
  amount: "numeric",
  txid: "string",
  initialDate: "string",
};

const auditTrialValidationRules = {
  recordType: "required|string",
  partnerUUID: "string",
  profileId: "string",
  eventId: "string",
  whitelistId: "string",
  fieldsUpdated: "string",
};

const leadersValidationRule = {
  napaSocialMediaAccountId: "required|string|email",
  profileName: "required|string",
  leaderType: "required|string",
  number: "required|numeric",
  rank: "required|numeric|between:1,25",
};

export {
  userValidationRule,
  partnerValidationRule,
  whitelistValidationRule,
  faqValidationRule,
  eventsValidationRule,
  trendingValidationRules,
  auditTrialValidationRules,
  leadersValidationRule,
};
