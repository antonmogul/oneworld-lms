import { PublicAuth } from "@middleware/public";
import tokenGenerator from "@services/auth/token-generator";
import { hashString, isSameHash } from "@services/hash";
import prisma, { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "orm";
import { ContextType } from "types/ContextType";
import { GraphQLUpload } from "graphql-upload";
import { FileUpload } from "types/file-upload";
import { getFileSize, validateFileExtension } from "@utils/common-functions";
import { AWSS3Uploader } from "@services/s3";

@ObjectType()
export class PublicChangePasswordResponse {
    @Field(() => String)
    token!: string;
    @Field(() => String)
    firstName!: string;
    @Field(() => String)
    lastName!: string;
}

@ObjectType()
export class UserMeResponse {
    @Field(() => String)
    firstName!: string;
    @Field(() => String)
    lastName!: string;
    @Field(() => String)
    email!: string;
    @Field(() => String)
    avatar!: string;
    @Field(() => String, {
        nullable: true
    })
    airline!: string;
}

@Resolver()
export default class PublicSettingsResolver {
    s3Uploader: AWSS3Uploader;

    constructor() {
        this.s3Uploader = new AWSS3Uploader({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            bucketName: process.env.AWS_S3_BUCKET_NAME,
        });
    }

    @Mutation(() => PublicChangePasswordResponse)
    @UseMiddleware(PublicAuth)
    async publicChangePassword(
        @Arg("oldPassword") oldPassword: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() ctx: ContextType
    ): Promise<PublicChangePasswordResponse> {
        const user = await prisma.user.findFirst({
            where: {
                id: ctx.user,
                enabled: true
            },
        });

        if (!user) {
            throw new Error("Invalid user");
        }

        const isSamePassword = await isSameHash(
            oldPassword,
            user.password
        );
        if (!isSamePassword) {
            throw new Error("Invalid password");
        }
        let hashedPassword = await hashString(newPassword);
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
                tokenVersion: user.tokenVersion + 1,
            },
        });

        const { token } = tokenGenerator(
            "user",
            {
                id: user.id,
                version: user.tokenVersion + 1,
            },
            ctx.res
        );

        return {
            token,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }

    @Mutation(() => String)
    @UseMiddleware(PublicAuth)
    async publicUploadAvatar(
        @Arg("file", () => GraphQLUpload) file: FileUpload,
        @Ctx() ctx: ContextType
    ): Promise<string> {
        const receivedFile = await file;
        const fileSize = (await getFileSize(
            receivedFile.createReadStream
        )) / 1024;
        const filenameArr = file.filename.split('.');
        const filename = `${filenameArr[0]}-${new Date().getTime()}`;
        if (fileSize > 5 * 1024) {
            throw Error(
                "Please upload file with size less than 5MB!"
            );
        }
        validateFileExtension(receivedFile.filename, [
            "jpeg",
            "jpg",
            "png",
            "webp",
            "gif"
        ]);
        const _user = await prisma.user.findUnique({
            where: {
                id: ctx.user
            }
        });
        const filePath =
            this.s3Uploader.createDestinationFilePath(
                `${_user.email.toLowerCase()}-${_user.id}`,
                filename,
                receivedFile.filename.split(".")[1]
            );
        const uploadStream =
            this.s3Uploader.createUploadStream(filePath);
        receivedFile
            .createReadStream()
            .pipe(uploadStream.writeStream);
        const result = await uploadStream.promise;

        if (_user.avatar) {
            await this.s3Uploader.deleteFilesFromBucket([_user.avatar]);
        }

        await prisma.user.update({
            where: {
                id: ctx.user
            },
            data: {
                avatar: result.Key
            }
        });

        return result.Location;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(PublicAuth)
    async publicDeleteAvatar(
        @Ctx() ctx: ContextType
    ): Promise<boolean> {
        const _user = await prisma.user.findUnique({
            where: {
                id: ctx.user
            }
        });

        await this.s3Uploader.deleteFilesFromBucket([_user.avatar]);

        await prisma.user.update({
            where: {
                id: ctx.user
            },
            data: {
                avatar: ""
            }
        });

        return true;
    }

    @Query(() => UserMeResponse)
    @UseMiddleware(PublicAuth)
    async userMe(@Ctx() ctx: ContextType) {
        const user = await prisma.user.findUnique({
            where: {
                id: ctx.user,
            },
            include: {
                airline: {
                    select: {
                        title: true
                    }
                }
            }
        });

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email.toLowerCase(),
            avatar: user.avatar,
            airline: user.airline.title
        };
    }

    @Mutation(() => Boolean)
    async updateUserEmailSubscriptionStatus(
        @Arg("email") email: string,
        @Arg("status") status: boolean
    ) {
        const decryptedEmail = Buffer.from(email, "base64").toString();
        if (decryptedEmail) {
            const _user = await prisma.user.findFirst({
                where: {
                    email: decryptedEmail
                }
            });

            if (_user) {
                await prisma.user.update({
                    where: {
                        id: _user.id
                    },
                    data: {
                        emailSubscription: status
                    }
                });

                return status;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}