const userValidationRule = {
  accountNumber: "required|string",
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
  eventDetailsShortDescription: "required|string",
  eventDetailsLongDescription: "required|string",
  partnerUUID: "required|string",
  likes: "numeric",
  status: "required|string",
  location: "required|string",
  tags: "required|string",
  napaPerks: "required|string",
  eventRules: "required|string",
  entryFees: "required|string",
  sponsors: "required|string",
  paid: "required|string",
  amount: "required|numeric",
  txid: "required|string",
};

const trendingValidationRules = {
  articleTitle: "required|string",
  articleBody: "required|string",
  articleHeadline: "required|string",
  nftProject: "string",
  socialMediaCompaign: "string",
  articleTags: "required|string",
  articleType: "required|string",
  partnerUUID: "required|string",
  author: "required|string",
  articleStartDate: "required|string",
  articleEndDate: "required|string",
  postAdInNapaApp: "required|string",
  totalRunDays: "required|string",
  paid: "required|string",
  articleStatus: "required|string",
  amount: "numeric",
  txid: "string",
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
