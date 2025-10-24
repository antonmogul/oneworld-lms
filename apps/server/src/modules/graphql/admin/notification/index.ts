import { AdminAuth } from "@middleware/admin";
import prisma, {
  Arg,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "orm";
import { notificationType } from "orm/generated";
import { Notification } from "orm/generated/type-graphql";

@Resolver()
export default class AdminNotificationResolver {
  @Query(() => [Notification])
  @UseMiddleware(AdminAuth)
  async adminGetAllNotifications() {
    const notifications =
      await prisma.notification.findMany({
        where: {
          OR: [
            {
              type: "LESSON_UPDATE",
            },
            {
              type: "SYSTEM_UPDATE",
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const courseIds = notifications
      .filter((d) => d.type === "LESSON_UPDATE")
      .map((d) => d.notificationData);
    const courses = await prisma.lesson.findMany({
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

    const _newNotifications = notifications.map((d) => {
      if (d.type === "LESSON_UPDATE") {
        const _course = courses.find(
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

  @Mutation(() => Boolean)
  @UseMiddleware(AdminAuth)
  async adminCreateNotification(
    @Arg("title") title: string,
    @Arg("description") description: string,
    @Arg("type") type: notificationType,
    @Arg("notificationData") notificationData: string
  ) {
    await prisma.notification.create({
      data: {
        description,
        notificationData,
        title,
        type,
      },
    });

    //TODO:send email to users

    return true;
  }
}
