import { PublicAuth } from "@middleware/public";
import { emailTemplates, sendEmailWithTemplate } from "@services/email-service";
import { removeHTMLTags } from "@utils/common-functions";
import prisma, {
  Arg,
  Ctx,
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
  LessonProgressUpdateInput,
  Slides,
} from "orm/generated/type-graphql";
import { ContextType } from "types/ContextType";

@ObjectType()
class LessonProgressWithTotal extends LessonProgress {
  @Field(() => Lesson, {
    nullable: true,
  })
  lesson: Lesson;

  @Field(() => Number)
  totalSlides: number;
}

@Resolver()
export default class PublicDashboardResolver {
  @Mutation(() => Certificate)
  @UseMiddleware(PublicAuth)
  async createCertificate(
    @Arg("lessonId") lessonId: string,
    @Ctx() ctx: ContextType
  ): Promise<Certificate> {
    const _lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId
      },
      include: {
        certification: {
          select: {
            title: true
          }
        }
      }
    });
    const _checkCertificate =
      await prisma.certificate.findFirst({
        where: {
          certificationId: _lesson.certificationId,
          userId: ctx.user,
        },
      });
    if (!_checkCertificate) {
      const _newCertificate = await prisma.certificate.create({
        data: {
          certificationId: _lesson.certificationId,
          userId: ctx.user,
        },
      });
      const _user = await prisma.user.findFirst({
        where: {
          id: ctx.user
        }
      });
      const formatedTitle = removeHTMLTags(_lesson.certification.title).replace("oneworld", "<strong>one</strong>world");
      await sendEmailWithTemplate(_user.email, emailTemplates.COURSE_COMPLETION, {
        name: `${_user.firstName} ${_user.lastName}`,
        courseName: formatedTitle,
        completionDate: new Date().toLocaleDateString(),
        certificateName: formatedTitle,
        email: _user.email
      });

      return _newCertificate;
    }
    return _checkCertificate;
  }

  @Query(() => [Lesson])
  @UseMiddleware(PublicAuth)
  async getAllLessons(): Promise<Lesson[]> {
    const allLessons = await prisma.lesson.findMany({
      where: {
        enabled: true,
      },
    });
    return allLessons;
  }

  @Query(() => [Slides])
  @UseMiddleware(PublicAuth)
  async getLessonSlides(
    @Arg("lessonId") lessonId: string
  ): Promise<Slides[]> {
    const lessonSlides = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });
    const slides = await prisma.slides.findMany({
      where: {
        lessonId,
        type: "LESSONS",
        id: {
          in: JSON.parse(lessonSlides.lessonsSlides),
        },
      },
    });

    const _newSlides = (
      JSON.parse(lessonSlides.lessonsSlides) as string[]
    ).map((i) => {
      return slides.find((slide) => slide.id === i);
    });

    return _newSlides;
  }

  @Query(() => [Slides])
  @UseMiddleware(PublicAuth)
  async getQuizSlides(
    @Arg("lessonId") lessonId: string
  ): Promise<Slides[]> {
    const lessonSlides = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });
    const slides = await prisma.slides.findMany({
      where: {
        lessonId,
        type: "QUIZ",
        id: {
          in: JSON.parse(lessonSlides.quizSlides),
        },
      },
    });

    const _newSlides = (
      JSON.parse(lessonSlides.quizSlides) as string[]
    ).map((i) => {
      return slides.find((slide) => slide.id === i);
    });

    return _newSlides;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PublicAuth)
  async startLesson(
    @Arg("lessonId") lessonId: string,
    @Ctx() ctx: ContextType
  ): Promise<boolean> {
    const course = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!course) {
      throw new Error("Invalid CourseId!");
    }

    await prisma.lessonProgress.create({
      data: {
        progress: 0,
        userId: ctx.user,
        lessonId: lessonId,
      },
    });

    return true;
  }

  @Query(() => [LessonProgressWithTotal])
  @UseMiddleware(PublicAuth)
  async getAllLessonProgress(
    @Ctx() ctx: ContextType
  ): Promise<LessonProgressWithTotal[]> {
    const lessonProgresses =
      await prisma.lessonProgress.findMany({
        where: {
          userId: ctx.user,
          lesson: {
            enabled: true
          }
        },
      });
    const updateLessonProgresses = [];
    for (const courseProgress of lessonProgresses) {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: courseProgress.lessonId,
        },
      });
      const totalSlides =
        JSON.parse(lesson.lessonsSlides).length +
        JSON.parse(lesson.quizSlides).length;
        updateLessonProgresses.push({
        ...courseProgress,
        totalSlides,
        lesson,
      });
    }

    return updateLessonProgresses;
  }

  @Query(() => LessonProgressWithTotal)
  @UseMiddleware(PublicAuth)
  async getLessonProgress(
    @Arg("lessonId") lessonId: string,
    @Ctx() ctx: ContextType
  ): Promise<LessonProgressWithTotal> {
    const lessonProgress =
      await prisma.lessonProgress.findFirst({
        where: {
          userId: ctx.user,
          lessonId,
        },
        include: {
          lesson: true,
        },
      });
    if (lessonProgress) {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: lessonProgress.lessonId,
        },
      });
      const totalSlides =
        JSON.parse(lesson.lessonsSlides).length +
        JSON.parse(lesson.quizSlides).length;
      return { ...lessonProgress, lesson , totalSlides };
    } else {
      throw new Error("Lesson Progress not found!");
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PublicAuth)
  async updateLessonProgress(
    @Arg("lessonProgressId") lessonProgressId: string,
    @Arg("progress") progress: number,
    @Arg("isCompleted") isCompleted: boolean
  ): Promise<boolean> {
    const updateData: LessonProgressUpdateInput = {
      progress: {
        set: progress,
      },
      updatedAt: {
        set: new Date(),
      },
    };
    if (isCompleted) {
      updateData.completed = {
        set: isCompleted,
      };
      updateData.completedAt = {
        set: new Date(),
      };
    }
    const data = await prisma.lessonProgress.update({
      where: {
        id: lessonProgressId,
      },
      data: {
        ...updateData,
      },
      select: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        lesson: {
          select: {
            certification: {
              select: {
                title: true
              }
            }
          }
        }
      }
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PublicAuth)
  async restartLesson(
    @Arg("lessonId") lessonId: string,
    @Ctx() ctx: ContextType
  ): Promise<boolean> {
    const _lessonProgress = await prisma.lessonProgress.findFirst({
      where: {
        userId: ctx.user,
        lessonId
      },
      include: {
        lesson: true
      }
    });
    if (_lessonProgress) {
      await prisma.lessonProgress.delete({
        where: {
          id: _lessonProgress.id
        }
      });
      const _certificate = await prisma.certificate.findFirst({
        where: {
          certificationId: _lessonProgress.lesson.certificationId,
          userId: ctx.user
        }
      });
      if (_certificate) {
        await prisma.certificate.delete({
          where: {
            id: _certificate.id
          }
        });
      }

      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PublicAuth)
  async restartCourse(
    @Arg("certificationId") certificationId: string,
    @Ctx() ctx: ContextType
  ): Promise<boolean> {
      const _lessons = await prisma.lesson.findMany({
        where: {
          certificationId
        }
      });
      if (_lessons && _lessons.length) {
        await prisma.lessonProgress.deleteMany({
          where: {
            lessonId: {
              in: _lessons.map(l => l.id)
            },
            userId: ctx.user
          }
        });
        const _certificate = await prisma.certificate.findFirst({
          where: {
            certificationId,
            userId: ctx.user
          }
        });
        if (_certificate) {
          await prisma.certificate.delete({
            where: {
              id: _certificate.id
            }
          });
        }
      }

      return true;
  }
}
