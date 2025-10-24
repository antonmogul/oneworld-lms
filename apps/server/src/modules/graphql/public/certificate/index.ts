import { PublicAuth } from "@middleware/public";
import prisma, { Arg, Ctx, Field, ObjectType, Query, Resolver, UseMiddleware } from "orm";
import { Certificate, Certification, Lesson, LessonProgress } from "orm/generated/type-graphql";
import { ContextType } from "types/ContextType";

@ObjectType()
class PublicCertificateResponse extends Certificate {
  @Field(() => Certification)
  certification: Certification;
}


@ObjectType()
class PublicLessonProgressResponse extends Lesson {
    @Field(() => [LessonProgress], {
        nullable: true
    })
    lessonProgress?: LessonProgress[]
}

@ObjectType()
class PublicCertificationResponse extends Certification {
    @Field(() => [PublicLessonProgressResponse], {
        nullable: true
    })
    lesson?: PublicLessonProgressResponse[]
    @Field(() => [Certificate], {
        nullable: true
    })
    certificate?: Certificate[]
}

@ObjectType()
class PublicLessonProgressByIdResponse extends Lesson {
    @Field(() => [LessonProgress], {
        nullable: true
    })
    lessonProgress?: LessonProgress[]
}

@ObjectType()
class PublicCertificationByIdResponse extends Certification {
    @Field(() => [PublicLessonProgressByIdResponse], {
        nullable: true
    })
    lesson?: PublicLessonProgressByIdResponse[]
    @Field(() => [Certificate], {
        nullable: true
    })
    certificate?: Certificate[]
}



@Resolver()
export default class PublicCertificateResolver {
    
    @Query(() => [PublicCertificateResponse])
    @UseMiddleware(PublicAuth)
    async getCertificates(
        @Ctx() ctx: ContextType
    ) : Promise<PublicCertificateResponse[]> {
        const _certificates = await prisma.certificate.findMany({
            where: {
                userId: ctx.user
            },
            include: {
                certification: true
            }
        });

        return _certificates;
    }

    @Query(() => PublicCertificateResponse)
    @UseMiddleware(PublicAuth)
    async getCertificatesById(
        @Arg("certificateId") certificateId: string,
        @Ctx() ctx: ContextType
    ) : Promise<PublicCertificateResponse> {
        const _certificates = await prisma.certificate.findFirst({
            where: {
                userId: ctx.user,
                id: certificateId
            },
            include: {
                certification: true
            }
        });

        return _certificates;
    }

    @Query(() => [PublicCertificationResponse])
    @UseMiddleware(PublicAuth)
    async publicGetAllCertifications(
        @Ctx() ctx: ContextType
    ): Promise<PublicCertificationResponse[]> {
        const _certifications = await prisma.certification.findMany({
            include: {
                lesson: {
                    where: {
                        enabled: true
                    },
                    include: {
                        lessonProgress: {
                            where: {
                                userId: ctx.user
                            }
                        }
                    }
                },
                certificate: {
                    where: {
                        userId: ctx.user
                    }
                }
            }
        });

        return _certifications;
    }

    @Query(() => PublicCertificationByIdResponse)
    @UseMiddleware(PublicAuth)
    async publicGetCertificationById(
        @Arg("certificationId") certificationId: string,
        @Ctx() ctx: ContextType
    ): Promise<PublicCertificationByIdResponse> {
        const _certifications = await prisma.certification.findUnique({
            where: {
                id: certificationId
            },
            include: {
                lesson: {
                    where: {
                        enabled: true
                    },
                    include: {
                        lessonProgress: {
                            where: {
                                userId: ctx.user
                            }
                        }
                    }
                },
                certificate: {
                    where: {
                        userId: ctx.user
                    }
                }
            }
        });

        return _certifications;
    }
}