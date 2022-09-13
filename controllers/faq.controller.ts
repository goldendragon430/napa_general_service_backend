import Faq from "../models/faq.model";

const createFaqQuestion = async (req, res) => {
  try {
    const { faq } = req.body;

    const newFaq = new Faq(faq);

    const [faqData] = await newFaq.create();

    return res.status(201).json({
      message: "FAQ Question Created Successfully",
      question: faqData[0]?.question,
      response: faqData[0]?.response,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateFaqQuestion = async (req, res) => {
  try {
    const { faq } = req.body;

    const { questionId } = req.params;

    const newFaq = new Faq(faq);

    const [faqData] = await newFaq.update(questionId);

    return res.status(200).json({
      message: "FAQ Question Updated Successfully",
      question: faqData[0].question,
      response: faqData[0].response,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getFaqQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const [faq] = await Faq.findOne(questionId);

    return res.status(200).json({ faq: faq[0] });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { createFaqQuestion, updateFaqQuestion, getFaqQuestion };
