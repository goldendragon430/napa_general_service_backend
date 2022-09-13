import Whitelist from "../models/whitelist.model";

const createWhitelist = async (req, res) => {
  try {
    const { whitelist } = req.body;

    const newWhitelist = new Whitelist(whitelist);

    const [whitelistData] = await newWhitelist.create();

    res.status(201).json({
      message: "Whitelist Created Successfully",
      profileId: whitelistData[0]?.profileId,
      name: whitelistData[0]?.name,
      address: whitelistData[0].address,
      status: whitelistData[0].status,
      currency: whitelistData[0].currency,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateWhitelist = async (req, res) => {
  try {
    const { whitelist } = req.body;

    const { whitelistId } = req.params;

    const newWhitelist = new Whitelist(whitelist);

    const [whitelistData] = await newWhitelist.update(whitelistId);

    res.status(201).json({
      message: "Whitelist Updated Successfully",
      profileId: whitelistData[0]?.profileId,
      name: whitelistData[0]?.name,
      address: whitelistData[0].address,
      status: whitelistData[0].status,
      currency: whitelistData[0].currency,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllWhitelist = async (req, res) => {
  try {
    const { status } = req.params;

    const [whitelist] = await Whitelist.findAll(status);

    return res.status(200).json({
      whitelist,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createWhitelist, updateWhitelist, getAllWhitelist };
