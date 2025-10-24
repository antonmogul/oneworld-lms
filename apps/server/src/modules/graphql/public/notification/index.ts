import { PublicAuth } from "@middleware/public";
import prisma, {
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "orm";
import { Notification } from "orm/generated/type-graphql";
import { ContextType } from "types/ContextType";

@Resolver()
export default class PublicNotificationResolver {
  @Query(() => Date)
  @UseMiddleware(PublicAuth)
  async getUserNotificationLastSeen(
    @Ctx() ctx: ContextType
  ): Promise<Date> {
    const _user = await prisma.user.findUnique({
      where: {
        id: ctx.user,
      },
    });

    return _user.lastNotification || new Date();
  }
  @Query(() => Date)
  @UseMiddleware(PublicAuth)
  async getAndUpdateUserNotificationLastSeen(
    @Ctx() ctx: ContextType
  ): Promise<Date> {
    const _user = await prisma.user.findUnique({
      where: {
        id: ctx.user,
      },
    });
    await prisma.user.update({
      where: {
        id: ctx.user,
      },
      data: {
        lastNotification: new Date(),
      },
    });

    return _user.lastNotification || new Date();
  }

  @Query(() => [Notification])
  @UseMiddleware(PublicAuth)
  async getAllNotifications(
    @Ctx() ctx: ContextType
  ): Promise<Notification[]> {
    let _allNotifications =
      await prisma.notification.findMany({
        where: {
          type: {
            in: ["LESSON_UPDATE", "SYSTEM_UPDATE"],
          },
        },
      });

    const _courseUpdates =
      await prisma.notification.findMany({
        where: {
          type: "REMINDER",
          userId: ctx.user,
        },
      });

    _allNotifications.push(..._courseUpdates);

    const courseIds = _allNotifications
      .filter(
        (d) =>
          d.type === "LESSON_UPDATE" ||
          d.type === "REMINDER"
      )
      .map((d) => d.notificationData);
    const lessons = await prisma.lesson.findMany({
      where: {
        id: {
          in: courseIds,
        },
      },
      select: {
        id: true,
        title: true,
        image: true,
        tag: true,
      },
    });

    const _newNotifications = _allNotifications.map((d) => {
      if (
        d.type === "LESSON_UPDATE" ||
        d.type === "REMINDER"
      ) {
        const _course = lessons.find(
          (c) => c.id === d.notificationData
        );
        if (_course) {
          return {
            ...d,
            notificationData: JSON.stringify(_course),
          };
        }

        return {
          ...d,
          notificationData: JSON.stringify({
            id: "",
            title: "Unknown Course",
            image: "",
            tag: "Unknown",
          }),
        };
      }

      return d;
    });

    return _newNotifications;
  }

  @Query(() => [Notification])
  @UseMiddleware(PublicAuth)
  async getCourseUpdateNotification(): Promise<
    Notification[]
  > {
    const _courseUpdates =
      await prisma.notification.findMany({
        where: {
          type: "LESSON_UPDATE",
        },
      });

    const courseIds = _courseUpdates
      .filter(
        (d) =>
          d.type === "LESSON_UPDATE" ||
          d.type === "REMINDER"
      )
      .map((d) => d.notificationData);
    const lessons = await prisma.lesson.findMany({
      where: {
        id: {
          in: courseIds,
        },
      },
      select: {
        id: true,
        title: true,
        image: true,
        tag: true,
      },
    });

    const _newNotifications = _courseUpdates.map((d) => {
      if (
        d.type === "LESSON_UPDATE" ||
        d.type === "REMINDER"
      ) {
        const _lesson = lessons.find(
          (c) => c.id === d.notificationData
        );
        if (_lesson) {
          return {
            ...d,
            notificationData: JSON.stringify(_lesson),
          };
        }

        return {
          ...d,
          notificationData: JSON.stringify({
            id: "",
            title: "Unknown Course",
            image: "",
            tag: "Unknown",
          }),
        };
      }

      return d;
    });

    return _newNotifications;
  }

  @Query(() => [Notification])
  @UseMiddleware(PublicAuth)
  async getReminderNotification(
    @Ctx() ctx: ContextType
  ): Promise<Notification[]> {
    const _courseUpdates =
      await prisma.notification.findMany({
        where: {
          type: "REMINDER",
          userId: ctx.user,
        },
      });

    const courseIds = _courseUpdates
      .filter(
        (d) =>
          d.type === "LESSON_UPDATE" ||
          d.type === "REMINDER"
      )
      .map((d) => d.notificationData);
    const lessons = await prisma.lesson.findMany({
      where: {
        id: {
          in: courseIds,
        },
      },
      select: {
        id: true,
        title: true,
        image: true,
        tag: true,
      },
    });

    const _newNotifications = _courseUpdates.map((d) => {
      if (
        d.type === "LESSON_UPDATE" ||
        d.type === "REMINDER"
      ) {
        const _lesson = lessons.find(
          (c) => c.id === d.notificationData
        );
        if (_lesson) {
          return {
            ...d,
            notificationData: JSON.stringify(_lesson),
          };
        }

        return {
          ...d,
          notificationData: JSON.stringify({
            id: "",
            title: "Unknown Course",
            image: "",
            tag: "Unknown",
          }),
        };
      }

      return d;
    });

    return _newNotifications;
  }

  @Query(() => [Notification])
  @UseMiddleware(PublicAuth)
  async getSystemNotification(): Promise<Notification[]> {
    const _courseUpdates =
      await prisma.notification.findMany({
        where: {
          type: "SYSTEM_UPDATE",
        },
      });

    const courseIds = _courseUpdates
      .filter(
        (d) =>
          d.type === "LESSON_UPDATE" ||
          d.type === "REMINDER"
      )
      .map((d) => d.notificationData);
    const lessons = await prisma.lesson.findMany({
      where: {
        id: {
          in: courseIds,
        },
      },
      select: {
        id: true,
        title: true,
        image: true,
        tag: true,
      },
    });

    const _newNotifications = _courseUpdates.map((d) => {
      if (
        d.type === "LESSON_UPDATE" ||
        d.type === "REMINDER"
      ) {
        const _lesson = lessons.find(
          (c) => c.id === d.notificationData
        );
        if (_lesson) {
          return {
            ...d,
            notificationData: JSON.stringify(_lesson),
          };
        }

        return {
          ...d,
          notificationData: JSON.stringify({
            id: "",
            title: "Unknown Course",
            image: "",
            tag: "Unknown",
          }),
        };
      }

      return d;
    });

    return _newNotifications;
  }
}
