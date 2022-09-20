const validate = require("../utils/validate");
const response = require("../utils/api-response");

const typeValidation = (validationRule) => {
  return async (req, res, next) => {
    const { user, partner, whitelist, faq, events, trending, audit, leaders } =
      req.body;
    await validate(
      user ||
        partner ||
        whitelist ||
        faq ||
        events ||
        trending ||
        audit ||
        leaders,
      validationRule,
      {},
      (err, status) => {
        if (!status) {
          return response.validationRuleResponse(
            res,
            "Please enter a valid type",
            err
          );
        } else {
          next();
        }
      }
    ).catch((err) => {
      console.log("err", err);
    });
  };
};

module.exports = { typeValidation };
