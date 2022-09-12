import { validateEmail } from "../utils/validation-email";
import Partners from "../models/partners.model";

const createPartnerAccount = async (req, res) => {
  try {
    const { partner } = req.body;

    if (!validateEmail(partner.email)) {
      return res.status(400).json({
        message: "Email is not valid",
      });
    }

    const newPartner = new Partners(partner);

    const [partnerData] = await newPartner.save();

    return res.status(201).json({
      message: "Partner Account Created Successfully",
      partnerUUID: partnerData[0]?.partnerUUID,
      profileName: partnerData[0]?.profileName,
      createdAt: partnerData[0].createdAt,
      primaryCurrency: partnerData[0].primaryCurrency,
      timezone: partnerData[0].timezone,
      email: partnerData[0].email,
      website: partnerData[0].website,
      contactPerson: partnerData[0].contactPerson,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getPartnerAccountDetails = async (req, res) => {
  try {
    const { partnerUUID } = req.params;

    const [partner] = await Partners.getPartnerAccountDetails(partnerUUID);

    // @ts-ignore
    if (!partner.length) {
      return res.status(404).json({
        message: "Partner Not Found",
      });
    }

    return res.status(200).json({ partner: partner[0] });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updatePartnerAccount = async (req, res) => {
  try {
    const { partnerUUID } = req.params;

    const { partner } = req.body;

    const updatePartner = new Partners(partner);

    const [partnerData] = await updatePartner.update(partnerUUID);

    //@ts-ignore
    if (!partnerData.length) {
      return res.status(404).json({
        message: "Partner Not Found",
      });
    }

    return res.status(201).json({
      message: "Partner Account Updated Successfully",
      partnerUUID: partnerData[0]?.partnerUUID,
      profileName: partnerData[0]?.profileName,
      createdAt: partnerData[0].createdAt,
      primaryCurrency: partnerData[0].primaryCurrency,
      timezone: partnerData[0].timezone,
      email: partnerData[0].email,
      website: partnerData[0].website,
      contactPerson: partnerData[0].contactPerson,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPartnerAccount,
  getPartnerAccountDetails,
  updatePartnerAccount,
};
