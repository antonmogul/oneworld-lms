import { PublicAuth } from "@middleware/public";
import prisma, {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "orm";
import { MediaContent } from "orm/generated/type-graphql";
import { FileUpload } from "types/file-upload";
import { GraphQLUpload } from "graphql-upload";
import { ContextType } from "types/ContextType";
import { mediaContent } from "orm/generated";
import {
  getFileSize,
  validateFileExtension,
} from "@utils/common-functions";
import { AWSS3Uploader } from "@services/s3";
import { S3_MEDIA_FOLDER_NAME } from "@config/global";
import { AdminAuth } from "@middleware/admin";

@Resolver()
export default class AdminMediaResolver {
  s3Uploader: AWSS3Uploader;

  constructor() {
    this.s3Uploader = new AWSS3Uploader({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucketName: process.env.AWS_S3_BUCKET_NAME,
    });
  }

  @Mutation(() => [MediaContent])
  @UseMiddleware(AdminAuth)
  async uploadMedia(
    @Arg("files", () => [GraphQLUpload])
    files: FileUpload[],
    @Arg("fileNames", () => [String], { nullable: true })
    fileNames: string[] = [],
    @Ctx() ctx: ContextType
  ): Promise<MediaContent[]> {
    try {
      let newFiles: mediaContent[] = [];
      let fileIndex = 0;
      for (let file of files) {
        const receivedFile = await file;
        const fileSize =
          (await getFileSize(
            receivedFile.createReadStream
          )) / 1024;
        let filename = fileNames[fileIndex];
        if (!filename) {
          filename = receivedFile.filename
            .split(".")[0]
            .replace(" ", "");
        } else {
          filename = filename.replace(" ", "");
        }
        const filenameArr =
          receivedFile.filename.split(".");
        const checkFilename =
          await prisma.mediaContent.count({
            where: {
              name: filename,
            },
          });
        if (checkFilename > 0) {
          throw Error("File with same name aleady exist!");
        }
        if (fileSize > 5 * 1024) {
          throw Error(
            "Please upload file with size less than 5MB!"
          );
        }
        validateFileExtension(receivedFile.filename, [
          "jpeg",
          "jpg",
          "gif",
          "png",
          "webp",
          "webm",
          "mov",
          "mp4",
          "svg",
          "pdf"
        ]);
        const filePath =
          this.s3Uploader.createDestinationFilePath(
            S3_MEDIA_FOLDER_NAME,
            filename,
            filenameArr[1]
          );
        const uploadStream =
          this.s3Uploader.createUploadStream(filePath);
        receivedFile
          .createReadStream()
          .pipe(uploadStream.writeStream);
        const result = await uploadStream.promise;
        newFiles.push(
          await prisma.mediaContent.create({
            data: {
              name: filename,
              size: `${fileSize.toFixed(2)} kb`,
              type: receivedFile.mimetype,
              publicURL: encodeURI(result.Key),
              createdBy: ctx.user,
            },
          })
        );
        fileIndex++;
      }

      return this.listMedia();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Query(() => [MediaContent])
  @UseMiddleware(AdminAuth)
  async listMedia(): Promise<MediaContent[]> {
    const _mediaList = await prisma.mediaContent.findMany({
      where: {
        enabled: true,
      },
    });

    return _mediaList;
  }
}
