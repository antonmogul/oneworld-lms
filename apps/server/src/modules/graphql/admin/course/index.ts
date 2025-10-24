import { userAgent } from "@googlemaps/google-maps-services-js";
import { AdminAuth } from "@middleware/admin";
import { MemoryDB } from "aws-sdk";
import prisma, {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "orm";
import { slideType } from "orm/generated";
import { Lesson, Slides } from "orm/generated/type-graphql";
import { ContextType } from "types/ContextType";

@Resolver()
export default class AdminCourseResolver {
  @Mutation(() => Lesson)
  @UseMiddleware(AdminAuth)
  async adminCreateBlankCourse(@Ctx() ctx: ContextType) {
    const lesson = await prisma.lesson.create({
      data: {
        image: "",
        certificationDetails: "",
        lessonsSlides: "[]",
        quizSlides: "[]",
        tag: "",
        title: "Untitled",
        enabled: false,
        plainTitle: "Untitled"
      },
    });

    return lesson;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AdminAuth)
  async adminUpdateCourseStatus(
    @Arg("lessonId") lessonId: string,
    @Arg("status") status: boolean
  ) {
    const course = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }
    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        enabled: status,
        updatedAt: new Date(),
      },
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AdminAuth)
  async adminUpdateCourseDetails(
    @Arg("lessonId") lessonId: string,
    @Arg("title") title: string,
    @Arg("plainTitle") plainTitle: string,
    @Arg("tag") tag: string,
    @Arg("image") image: string,
    @Arg("certificationId") certificationId: string
  ) {
    const course = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }
    await prisma.lesson.update({
      where: {
        id: lessonId
      },
      data: {
        updatedAt: new Date(),
        image,
        title,
        tag,
        certificationId,
        plainTitle
      },
    });

    return true;
  }
  @Mutation(() => Boolean)
  @UseMiddleware(AdminAuth)
  async adminUpdateCourseCertificateDetails(
    @Arg("lessonId") lessonId: string,
    @Arg("certificationDetails")
    certificationDetails: string
  ) {
    const course = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }
    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        certificationDetails,
        updatedAt: new Date(),
      },
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AdminAuth)
  async adminUpdateSuccessDetails(
    @Arg("lessonId") lessonId: string,
    @Arg("successTitle") successTitle: string,
    @Arg("successDescription") successDescription: string,
    @Arg("successButtonText") successButtonText: string,
  ) {
    const course = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }
    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        successTitle,
        successDescription,
        successButtonText,
        updatedAt: new Date(),
      },
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AdminAuth)
  async adminUpdateCourseLessonsDetails(
    @Arg("lessonId") lessonId: string,
    @Arg("lessons")
    lessons: string
  ) {
    const course = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }
    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        lessonsSlides: lessons,
        updatedAt: new Date(),
      },
    });

    return true;
  }
  @Mutation(() => Boolean)
  @UseMiddleware(AdminAuth)
  async adminUpdateQuizLessonsDetails(
    @Arg("lessonId") lessonId: string,
    @Arg("quizes")
    quizes: string
  ) {
    const course = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }
    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        quizSlides: quizes,
        updatedAt: new Date(),
      },
    });

    return true;
  }

  @Query(() => Lesson)
  @UseMiddleware(AdminAuth)
  async adminGetCourse(@Arg("lessonId") lessonId: string) {
    const course = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      include: {
        certification: true
      }
    });

    if (!course) {
      throw new Error("Course not found");
    }

    return course;
  }
  @Query(() => [Lesson])
  @UseMiddleware(AdminAuth)
  async adminGetAllCourse() {
    const course = await prisma.lesson.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        certification: true
      }
    });

    return course;
  }

  @Query(() => [Slides])
  @UseMiddleware(AdminAuth)
  async adminGetSlides(
    @Arg("slidesIds", () => [String]) slidesIds: string[]
  ) {
    const slides = await prisma.slides.findMany({
      where: {
        id: {
          in: slidesIds,
        },
      },
    });

    return slides;
  }

  @Mutation(() => Slides)
  @UseMiddleware(AdminAuth)
  async adminCreateBlankSlide(
    @Arg("lessonId") lessonId: string,
    @Arg("templateKey") templateKey: string,
    @Arg("type") type: slideType,
    @Arg("swipeGroupValue") swipeGroupValue: number
  ) {
    const course = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }
    const slide = await prisma.slides.create({
      data: {
        lessonId: lessonId,
        templateKey,
        data: JSON.stringify({ swipeGroupValue }),
        type,
      },
    });

    return slide;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AdminAuth)
  async adminRemoveSlide(
    @Arg("slideId") slideId: string,
    @Arg("lessonId") lessonId: string
  ) {
    const course = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }
    const slide = await prisma.slides.findUnique({
      where: {
        id: slideId,
      },
    });

    if (!slide) {
      throw new Error("slide not found");
    }

    if (slide.type === "LESSONS")
      await prisma.lesson.update({
        where: {
          id: lessonId,
        },
        data: {
          updatedAt: new Date(),
          lessonsSlides: JSON.stringify(
            [...JSON.parse(course.lessonsSlides)].filter(
              (d) => d !== slideId
            )
          ),
        },
      });
    if (slide.type === "QUIZ")
      await prisma.lesson.update({
        where: {
          id: lessonId,
        },
        data: {
          updatedAt: new Date(),
          quizSlides: JSON.stringify(
            [...JSON.parse(course.quizSlides)].filter(
              (d) => d !== slideId
            )
          ),
        },
      });

    await prisma.slides.delete({
      where: {
        id: slideId,
      },
    });

    return slide;
  }

  @Mutation(() => Slides)
  @UseMiddleware(AdminAuth)
  async adminUpdateSlide(
    @Arg("slideId") slideId: string,
    @Arg("data") data: string
  ) {
    const slide = await prisma.slides.findUnique({
      where: {
        id: slideId,
      },
    });

    if (!slide) {
      throw new Error("slide not found");
    }

    const updatedSlide = await prisma.slides.update({
      where: {
        id: slideId,
      },
      data: {
        data,
      },
    });

    return updatedSlide;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AdminAuth)
  async adminDeleteCourse(
    @Arg("lessonId") lessonId: string
  ): Promise<boolean> {
    const _course = await prisma.lesson.findUnique({
      where: {
        id: lessonId
      }
    });
    
    if (!_course) {
      throw Error("course not found!");
    }

    await prisma.slides.deleteMany({
      where: {
        lessonId
      }
    });

    await prisma.lessonProgress.deleteMany({
      where: {
        lessonId
      }
    });

    await prisma.lesson.delete({
      where: {
        id: lessonId
      }
    });

    return true;
  } 
}
