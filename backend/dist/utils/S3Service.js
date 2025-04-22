"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDownloadSignedUrl = exports.deleteFile = exports.getUploadSignedUrl = exports.uploadFileToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client_s3_2 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../lib/config"));
const MAX_FILE_SIZE = 2 * 1024 * 1024; //5 MB
// Initialize S3 Client
const s3 = new client_s3_1.S3Client({
    region: config_1.default.AWS_REGION,
    credentials: {
        accessKeyId: config_1.default.AWS_ACCESS_KEY_ID,
        secretAccessKey: config_1.default.AWS_SECRET_ACCESS_KEY
    }
});
const uploadFileToS3 = (file, fileDir) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileKey = `${fileDir}/${(0, uuid_1.v4)()}-${file.originalname}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype
        });
        yield s3.send(command);
        return {
            fileName: fileKey
        };
    }
    catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('File upload failed');
    }
});
exports.uploadFileToS3 = uploadFileToS3;
// // Generate a Pre-Signed Upload URL
const getUploadSignedUrl = (fileType_1, ...args_1) => __awaiter(void 0, [fileType_1, ...args_1], void 0, function* (fileType, file_size = MAX_FILE_SIZE, basepath) {
    try {
        const fileKey = `${basepath}/${(0, uuid_1.v4)()}.${fileType.split('/')[1]}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: config_1.default.AWS_BUCKET_NAME,
            Key: fileKey,
            ContentType: fileType,
            ContentLength: file_size
        });
        const uploadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 120 });
        return {
            uploadUrl,
            fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
            fileKey: fileKey
        };
    }
    catch (error) {
        console.error('Error generating signed URL:', error);
        throw new Error('Failed to generate pre-signed URL');
    }
});
exports.getUploadSignedUrl = getUploadSignedUrl;
const deleteFile = (fileKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey
        });
        yield s3.send(command);
        return { message: 'File deleted successfully' };
    }
    catch (error) {
        console.error('Error deleting file:', error);
        throw new Error('File deletion failed');
    }
});
exports.deleteFile = deleteFile;
const getDownloadSignedUrl = (fileKey_1, ...args_1) => __awaiter(void 0, [fileKey_1, ...args_1], void 0, function* (fileKey, expiresIn = 300) {
    try {
        const command = new client_s3_2.GetObjectCommand({
            Bucket: config_1.default.AWS_BUCKET_NAME,
            Key: fileKey
        });
        // expire in seconds
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn });
        return { signedUrl };
    }
    catch (error) {
        console.error('Error generating download URL:', error);
        throw new Error('Failed to generate download URL');
    }
});
exports.getDownloadSignedUrl = getDownloadSignedUrl;
