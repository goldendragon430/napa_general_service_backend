import { S3 } from "aws-sdk";

const uploadS3 = async (avatarId, type, file) => {
  const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.SOCIAL_ART_ACCESS_KEY,
    secretAccessKey: process.env.SOCIAL_ART_SECRET_KEY,
    region: process.env.SOCIAL_ART_REGION,
    signatureVersion: "v4",
  });
  const ex = (type as string).split("/")[1];
  const params = {
    Bucket: process.env.SOCIAL_ART_BUCKET_NAME,
    Key: `${avatarId}.${ex}`,
    ContentType: `image/${ex}`,
    Body: file.buffer,
    ACL: "public-read",
  };
  const result = await s3.upload(params).promise();
  return result;
};

export { uploadS3 };
