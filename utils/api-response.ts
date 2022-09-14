const successResponse = (res, msg) => {
  const data = {
    code: 200,
    responseTimeStamp: Date.now(),
    message: msg,
  };
  return res.status(200).json(data);
};

const successResponseWithData = (res, msg, data) => {
  const resData = {
    code: 200,
    responseTimeStamp: Date.now(),
    message: msg,
    data,
  };
  return res.status(200).json(resData);
};

const ErrorResponse = (res, msg) => {
  const data = {
    code: 500,
    responseTimeStamp: Date.now(),
    message: msg,
  };
  return res.status(500).json(data);
};

const notFoundResponse = (res, msg) => {
  const data = {
    code: 404,
    responseTimeStamp: Date.now(),
    message: msg,
  };
  return res.status(404).json(data);
};

const validationErrorWithData = (res, msg) => {
  const resData = {
    code: 400,
    responseTimeStamp: Date.now(),
    message: msg,
  };
  return res.status(400).json(resData);
};

const unauthorizedResponse = (res, msg) => {
  const data = {
    code: 401,
    responseTimeStamp: Date.now(),
    message: msg,
  };
  return res.status(401).json(data);
};

module.exports = {
  successResponse,
  successResponseWithData,
  ErrorResponse,
  notFoundResponse,
  validationErrorWithData,
  unauthorizedResponse,
};
