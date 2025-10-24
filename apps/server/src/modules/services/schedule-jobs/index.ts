import { emailTemplates, sendEmailWithTemplate } from "@services/email-service";
import dayjs from "dayjs";
import cron from "node-cron";
import prisma from "orm";

export async function initializeCronJob() {
    cron.schedule("0 0 * * *", async () => {
        await createReminderNotification();
    });
}

const createReminderNotification = async () => {
    const allLessonProgresses = await prisma.lessonProgress.findMany({
        where: {
            completed: false,
            updatedAt: {
                lte: dayjs().subtract(2, "days").toDate()
            }
        },
        include: {
            lesson: true
        }
    });
    let newReminderNotificationData = [];
    for (const lessonProgress of allLessonProgresses) {
        const checkReminderNotification = await prisma.notification.count({
            where: {
                notificationData: lessonProgress.lessonId,
                userId: lessonProgress.userId
            }
        });
        if (!checkReminderNotification) {
            newReminderNotificationData.push({
                notificationData: lessonProgress.lessonId,
                title: `Reminder Notification: ${lessonProgress.lesson.title}`,
                description: "Reminder Notification Description",
                type: "REMINDER",
                userId: lessonProgress.userId
            });
        }
    }

    for (const reminder of newReminderNotificationData) {
        const user = await prisma.user.findFirst({
            where: {
                id: reminder.userId
            }
        });
        const lesson = await prisma.lesson.findFirst({
            where: {
                id: reminder.notificationData
            },
            include: {
                lessonProgress: {
                    where: {
                        userId: user.id
                    }
                }
            }
        });
        const totalLessons = lesson.lessonsSlides ? JSON.parse(lesson.lessonsSlides).length : 0; 
        const totalQuizes = lesson.quizSlides ? JSON.parse(lesson.quizSlides).length : 0;
        const progressPercent = (lesson.lessonProgress[0].progress * 100)/(totalLessons + totalQuizes);
        if (progressPercent < 100) {
            await prisma.notification.create({
                data: reminder
            });
            // await sendEmailWithTemplate(user.email, emailTemplates.COURSE_COMPLETE_REMINDER, {
            //     name: `${user.firstName} ${user.lastName}`,
            //     courseName: course.plainTitle,
            //     progress: progressPercent,
            //     courseId: course.id,
            //     courseImage: course.image,
            //     email: user.email,
            // });
        }
    }

    return true;
}