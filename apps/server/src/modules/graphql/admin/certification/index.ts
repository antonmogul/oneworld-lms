import { AdminAuth } from "@middleware/admin";
import prisma, { Arg, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "orm";
import { Certificate, Certification } from "orm/generated/type-graphql";

@Resolver()
export default class AdminCertificationResolver {
    @Mutation(() => Boolean)
    @UseMiddleware(AdminAuth)
    async adminCreateCertification(
        @Arg("title") title: string,
        @Arg("image") image: string,
        @Arg("pdf") pdf: string,
        @Arg("certificateDetails") certificateDetails: string
    ): Promise<Boolean> {
        const _newCertification = await prisma.certification.create({
            data: {
                title,
                image,
                pdf,
                certificateDetails
            }
        });

        return true;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(AdminAuth)
    async adminUpdateCertification(
        @Arg("certificationId") certificationId: string,
        @Arg("title") title: string,
        @Arg("image") image: string,
        @Arg("pdf") pdf: string,
        @Arg("certificateDetails") certificateDetails: string
    ): Promise<Boolean> {
        const _certification = await prisma.certification.findUnique({
            where: {
                id: certificationId
            }
        });
        if (!_certification) {
            throw new Error("Cannot locate certificate to update!")
        }
        await prisma.certification.update({
            data: {
                title,
                image,
                pdf,
                certificateDetails
            },
            where: {
                id: certificationId
            }
        });
        return true;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(AdminAuth)
    async adminDeleteCertification(
        @Arg("certificationId") certificationId: string
    ): Promise<Boolean> {
        const _certifications = await prisma.certification.findUnique({
            where: {
                id: certificationId
            },
            include: {
                lesson: {
                    select: {
                        id: true
                    }
                }
            }
        });
        await prisma.lesson.updateMany({
            where: {
                id: {
                    in: _certifications.lesson.map(c => c.id)
                }
            },
            data: {
                certificationId: null,
                enabled: false
            }
        });
        await prisma.certification.delete({
            where: {
                id: certificationId
            }
        });
        
        return true;
    }

    @Query(() => [Certification])
    @UseMiddleware(AdminAuth)
    async adminGetAllCertifications(): Promise<Certification[]> {
        const _certifications = await prisma.certification.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return _certifications;
    }

    @Query(() => Certification)
    @UseMiddleware(AdminAuth)
    async adminGetCertificationById(
        @Arg("certificationId") certificationId: string
    ): Promise<Certification> {
        const _certification = await prisma.certification.findUnique({
            where: {
                id: certificationId
            }
        });

        return _certification;
    }

}
