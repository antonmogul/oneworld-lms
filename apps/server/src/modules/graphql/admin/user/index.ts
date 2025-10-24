import { AdminAuth } from "@middleware/admin";
import prisma, {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "orm";
import {
  Certificate,
  Lesson,
  LessonProgress,
  SavedItems,
  User,
} from "orm/generated/type-graphql";

@ObjectType()
class AdminUserDetails extends User {
  @Field(() => [LessonProgress])
  lessonProgress: LessonProgress[];
  @Field(() => [Certificate])
  certificate: Certificate[];
}
@ObjectType()
class LessonWithCounts extends Lesson {
  @Field(() => Number)
  slideCount: number;
}
@ObjectType()
class AdminSingleUserDetails {
  @Field(() => AdminUserDetails)
  user: AdminUserDetails;
  @Field(() => [LessonWithCounts])
  lessons: LessonWithCounts[];
}

@Resolver()
export default class AdminUserResolver {
  @Query(() => [User])
  @UseMiddleware(AdminAuth)
  async adminGetAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  }

  @Mutation(() => User)
  @UseMiddleware(AdminAuth)
  async adminUpdateUserStatus(
    @Arg("userId") userId: string,
    @Arg("status") status: boolean
  ) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        enabled: status,
      },
    });

    return updatedUser;
  }

  @Query(() => AdminSingleUserDetails)
  @UseMiddleware(AdminAuth)
  async adminGetUser(@Arg("userId") userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        certificate: true,
        lessonProgress: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const courseSet = new Set<string>();
    user.certificate.forEach((certificate) => {
      courseSet.add(certificate.certificationId);
    });
    user.lessonProgress.forEach((lessonProgress) => {
      courseSet.add(lessonProgress.lessonId);
    });

    const courses = await prisma.lesson.findMany({
      where: {
        id: {
          in: Array.from(courseSet),
        },
      },
      include: {
        slides: {
          select: {
            id: true,
          },
        },
      },
    });
    const _courses = courses.map(({ slides, ...rest }) => {
      const _slides = slides.filter(
        (d) =>
          rest.lessonsSlides.includes(d.id) ||
          rest.quizSlides.includes(d.id)
      );
      return {
        ...rest,
        slideCount: _slides.length,
      };
    });
    return {
      user,
      lessons: _courses,
    };
  }
}
