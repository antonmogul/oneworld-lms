import { AdminAuth } from "@middleware/admin";
import prisma, {
  Field,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "orm";

@ObjectType()
class DashboardResponse {
  @Field(() => Number)
  lessons: number;
  @Field(() => Number)
  users: number;
  @Field(() => Number)
  notifications: number;
}

@Resolver()
export class AdminDashboardResolver {
  @Query(() => DashboardResponse)
  @UseMiddleware(AdminAuth)
  async adminDashboard() {
    const lesson = await prisma.lesson.count({});
    const user = await prisma.user.count({});
    const notification = await prisma.notification.count(
      {}
    );
    return {
      lessons: lesson,
      users: user,
      notifications: notification,
    };
  }
}
