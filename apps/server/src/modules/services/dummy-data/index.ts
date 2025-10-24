import { hashString } from "@services/hash";
import prisma from "orm";
import { users, airlines } from "./users-data";
import dayjs from "dayjs";
import { randomUserIds, courseIds } from "./course-progress-data";

export const addUsers = async () => {
    let airlineNumber = 0;
    let dateNumber = 2;
    for (const user of users) {
        let airline;
        const email = `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@${airlines[airlineNumber]}`;
        const emailSplit = email.split("@");
        airline = await prisma.airline.findFirst({
            where: {
                domain: emailSplit[1]
            }
        });
        let hashedPassword = await hashString("Test123");
        const _newUser = await prisma.user.create({
            data: {
                email:email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: hashedPassword,
                avatar: "",
                airlineId: airline.id,
                createdAt: dayjs(new Date(2023, 8, 30)).subtract(dateNumber, "days").toDate(),
                updatedAt: dayjs(new Date(2023, 8, 30)).subtract(dateNumber, "days").toDate(),
            },
        });
        if (airlineNumber === 3) {
            airlineNumber = 0;
        } else {
            airlineNumber++;
        }
        if (dateNumber === 30) {
            dateNumber = 1;
        } else {
            dateNumber++;
        }
    }
}

export const addCourseProgress = async () => {
    let courseNumber = 0;
    let dateNumber = 2;
    for (const user of randomUserIds) {
        const numberOfLessons = JSON.parse(courseIds[courseNumber].lessons).length;
        const progress = Math.floor(Math.random() * (numberOfLessons - 0 + 1)) + 0;
        const _newProgress = await prisma.lessonProgress.create({
            data: {
                lessonId: courseIds[courseNumber].courseId,
                userId: user.userId,
                progress: progress,
                completed: progress === numberOfLessons ? true : false,
                createdAt: dayjs(new Date(2023, 8, 30)).subtract(dateNumber, "days").toDate(),
                updatedAt: dayjs(new Date(2023, 8, 30)).subtract(dateNumber, "days").toDate(),
                completedAt: dayjs(new Date(2023, 8, 30)).subtract(dateNumber, "days").toDate(),
            }
        });
        if (courseNumber === 7) {
            courseNumber = 0;
        } else {
            courseNumber++;
        }
        if (dateNumber === 30) {
            dateNumber = 1;
        } else {
            dateNumber++;
        }
    }
}