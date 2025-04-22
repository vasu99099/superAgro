import { ImageStatus } from '@prisma/client';
import prisma from '../lib/prismaInit';

class TmpImageService {
  async uploadImage(user_id: number | null, imageKey: string | string[]) {
    if (Array.isArray(imageKey)) {
      const data = imageKey.map((key) => ({
        user_id,
        image_key: key,
        status: ImageStatus.PENDING
      }));

      await prisma.tempImage.createMany({
        data,
        skipDuplicates: true
      });

      return data;
    }

    return await prisma.tempImage.create({
      data: {
        user_id,
        image_key: imageKey,
        status: ImageStatus.PENDING
      }
    });
  }

  // ✅ Confirm Image (When Profile is Updated)
  async confirmImage(imageKey: string | string[]) {
    return await prisma.tempImage.updateMany({
      where: {
        image_key: Array.isArray(imageKey)
          ? { in: imageKey } // for multiple keys
          : imageKey // for single key
      },
      data: {
        status: ImageStatus.CONFIRMED
      }
    });
  }
  async deletedImage(imageKey: string | string[]) {
    if (Array.isArray(imageKey)) {
      const data = imageKey.map((key) => ({
        image_key: key,
        status: ImageStatus.DELETED
      }));

      await prisma.tempImage.createMany({
        data,
        skipDuplicates: true
      });

      return data;
    }

    return await prisma.tempImage.create({
      data: {
        image_key: imageKey,
        status: ImageStatus.DELETED
      }
    });
  }

  // ✅ Get PENDING Images (For Cron Cleanup)
  async getPendingImages() {
    return await prisma.tempImage.findMany({
      where: { status: ImageStatus.PENDING }
    });
  }

  // ✅ Delete Unused Images (Older than 30 mins)
  //   async deleteExpiredImages() {
  //     const expiredImages = await prisma.tempImage.findMany({
  //       where: {
  //         status: ImageStatus.PENDING,
  //         createdAt: { lte: new Date(Date.now() - 30 * 60 * 1000) } // Older than 30 mins
  //       }
  //     });

  //     for (const image of expiredImages) {
  //       await deleteFileFromS3(image.image_key); // Delete from S3
  //       await prisma.image.delete({ where: { id: image.id } }); // Delete from DB
  //     }

  //     return expiredImages.length;
  //   }
}

export default new TmpImageService();
