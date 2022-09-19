/* eslint-disable @typescript-eslint/no-var-requires */
import { Request, Response } from "express";
import AuditTrail from "../models/audit-trail.model";
const ApiResponse = require("../utils/api-response");

const createAuditTrial = async (req: Request, res: Response) => {
  try {
    console.log("Create Audit Trial Api Pending");

    const { audit } = req.body;

    const newAudit = new AuditTrail(audit);

    const [auditData] = await newAudit.create();

    console.log("Create Audit Trial Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Audit Created Successfully",
      {
        audit: auditData[0],
      }
    );
  } catch (error) {
    console.log("Create Audit Trial Api Rejected");
    console.log(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

const getAuditTrial = async (req: Request, res: Response) => {
  try {
    console.log("Get Audit Trial Api Pending");

    const { type } = req.query;

    // @ts-ignore
    const [trials] = await AuditTrail.getAllAuditTrials(type);

    console.log("Get Audit Trial Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Aduit Successfully",
      trials
    );
  } catch (error) {
    console.log("Get Audit Trial Api Rejected");
    console.log(error);
    return ApiResponse.ErrorResponse(res, error.message);
  }
};

module.exports = { createAuditTrial, getAuditTrial };
