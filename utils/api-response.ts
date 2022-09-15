import moment from "moment";

const successResponse = (res, msg) => {
  const data = {
    code: 200,
    responseTimeStamp: moment(new Date()).format("DD-MM-YYYY hh:mm:ss:ms"),
    message: msg,
  };
  return res.status(200).json(data);
};

const successResponseWithData = (res, msg, data) => {
  const resData = {
    code: 200,
    responseTimeStamp: moment(new Date()).format("DD-MM-YYYY hh:mm:ss:ms"),
    message: msg,
    data,
  };
  return res.status(200).json(resData);
};

const ErrorResponse = (res, msg) => {
  const data = {
    code: 500,
    responseTimeStamp: moment(new Date()).format("DD-MM-YYYY hh:mm:ss:ms"),
    message: msg,
  };
  return res.status(500).json(data);
};

const notFoundResponse = (res, msg) => {
  const data = {
    code: 404,
    responseTimeStamp: moment(new Date()).format("DD-MM-YYYY hh:mm:ss:ms"),
    message: msg,
  };
  return res.status(404).json(data);
};

const validationErrorWithData = (res, msg) => {
  const resData = {
    code: 400,
    responseTimeStamp: moment(new Date()).format("DD-MM-YYYY hh:mm:ss:ms"),
    message: msg,
  };
  return res.status(400).json(resData);
};

const unauthorizedResponse = (res, msg) => {
  const data = {
    code: 401,
    responseTimeStamp: moment(new Date()).format("DD-MM-YYYY hh:mm:ss:ms"),
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
