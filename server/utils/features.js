import { v2 as cloudinary } from "cloudinary";
import { ErrorHandler } from "./utility.js";
import { getBase64 } from "./helper.js";
import {v4 as uuid} from 'uuid'

export const emitEvent = (req, event, users, data) => {
  console.log("Emiting event:", event);
};

export const deleteFilesFromCloudinary = async (publicIds) => {
  console.log("Deleting files from Cloudinary:", publicIds);
};

export const uploadFilesToCloudinary = async (files = []) => {
  try {
  const upload = await Promise.all(
    files.map(async (file) => {
      const result = await cloudinary.uploader.upload(getBase64(file), {
        resource_type: "auto",
        public_id: uuid()
      });
      return result;
    }),
  );
  const formattedUpload = upload.map((result) => ({
    public_id: result.public_id,
    url: result.secure_url,
  }))
  return formattedUpload;
} catch(e) {
  throw new ErrorHandler("File upload failed", e.statusCode);
}
};
