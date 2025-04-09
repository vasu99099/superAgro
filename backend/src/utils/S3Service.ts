import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import config from '../lib/config';

const MAX_FILE_SIZE = 2 * 1024 * 1024; //5 MB

// Initialize S3 Client
const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  }
});

export const uploadFileToS3 = async (
  file: Express.Multer.File,
  fileDir: string
): Promise<{ fileName: string }> => {
  try {
    const fileKey = `${fileDir}/${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await s3.send(command);

    return {
      fileName: fileKey
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
};
// // Generate a Pre-Signed Upload URL

export const getUploadSignedUrl = async (fileType: string, file_size: number = MAX_FILE_SIZE, basepath: string) => {
  try {
    const fileKey = `${uuidv4()}.${fileType.split('/')[1]}`;

    const command = new PutObjectCommand({
      Bucket: config.AWS_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
      ContentLength: file_size
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 120 });

    return {
      uploadUrl,
      fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
      fileKey: fileKey
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate pre-signed URL');
  }
};

export const deleteFile = async (fileKey: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey
    });

    await s3.send(command);
    return { message: 'File deleted successfully' };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('File deletion failed');
  }
};

export const getDownloadSignedUrl = async (fileKey: string, expiresIn = 300) => {
  try {
    const command = new GetObjectCommand({
      Bucket: config.AWS_BUCKET_NAME,
      Key: fileKey
    });
    // expire in seconds
    const signedUrl = await getSignedUrl(s3, command, { expiresIn });
    return { signedUrl };
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
};
