import { AdminAuth } from "@middleware/admin";
import { parseDate } from "@utils/common-functions";
import dayjs from "dayjs";
import prisma, { Arg, Field, ObjectType, Query, Resolver, UseMiddleware } from "orm";
import { Airline } from "orm/generated/type-graphql";

@ObjectType()
export class UsersDataResponse {
    @Field(() => String, {
        nullable: true
    })
    date?: string

    @Field(() => Number, {
        nullable: true
    })
    month?: number

    @Field(() => String, {
        nullable: true
    })
    startDate?: string

    @Field(() => String, {
        nullable: true
    })
    endDate?: string

    @Field(() => Number)
    value: number
}

@ObjectType()
export class UsersDataResponseWithTotal {
    @Field(() => [UsersDataResponse])
    graphData: UsersDataResponse[]

    @Field(() => Number)
    totalActiveUsers: number
}

@ObjectType()
export class FullCertifiedDataResponse {
    @Field(() => Number)
    totalUsers: number

    @Field(() => Number)
    certifiedUsers: number

    @Field(() => Number)
    uncertifiedUsers: number
}

@ObjectType()
export class CoursesDataResponse {
    @Field(() => Number)
    coursesNotStarted: number

    @Field(() => Number)
    coursesNotCompleted: number

    @Field(() => Number)
    coursesCompleted: number
}
@ObjectType()
export class CourseCompletionRateResponse {
    @Field(() => String)
    courseTitle: string

    @Field(() => Number)
    completions: number
}

@Resolver()
export default class ReportsResolver {

    @Query(() => [Airline])
    @UseMiddleware(AdminAuth)
    async getAllAirlines(): Promise<Airline[]> {
        const _allAirlines = await prisma.airline.findMany({
            where: {
                enable: true
            }
        });
        return _allAirlines;
    }

    @Query(() => UsersDataResponseWithTotal)
    @UseMiddleware(AdminAuth)
    async getActiveUsers(
        @Arg("filter") filter: "DAILY" | "WEEKLY" | "MONTHLY",
        @Arg("airlineId", { nullable: true }) airlineId: string 
    ): Promise<UsersDataResponseWithTotal> {
        const currentDate = new Date();
        let totalActiveUsers;
        if (filter === "DAILY") {
            const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
            const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));
            let activeUsersProgressQuery: any = {
                where: {
                    OR: {
                        updatedAt: {
                            gte: firstDayOfWeek,
                            lte: lastDayOfWeek
                        },
                        completedAt: {
                            gte: firstDayOfWeek,
                            lte: lastDayOfWeek
                        }
                    }
                },
                orderBy: {
                    updatedAt: "desc"
                },
            };
            let activeUsersSavedItemsQuery: any = {
                where: {
                    OR: {
                        updatedAt: {
                            gte: firstDayOfWeek,
                            lte: lastDayOfWeek
                        },
                        createdAt: {
                            gte: firstDayOfWeek,
                            lte: lastDayOfWeek
                        }
                    }
                }
            };
            if (airlineId) {
                activeUsersSavedItemsQuery.where.user = {
                    airlineId
                };
                activeUsersProgressQuery.where.user = {
                    airlineId
                };
            }
            let activeUsersProgress = await prisma.lessonProgress.findMany(activeUsersProgressQuery);
            let activeUsersSavedItems = await prisma.savedItems.findMany(activeUsersSavedItemsQuery);
            const activeUsersCount: { date: string, value: number }[] = [];
            const userIdMonthMapping: { date: number, userId }[] = [];
            for (let i = 0; i < dayjs(lastDayOfWeek).diff(dayjs(firstDayOfWeek), "days") + 1; i++) {
                const date = parseDate(dayjs(firstDayOfWeek).add(i, "day").toISOString());
                let activeUsersObj: { date: string, value: number } = { date: null, value: null };
                activeUsersObj.date = dayjs(date).format("YYYY/MM/DD");
                activeUsersObj.value = activeUsersProgress.filter((au) => {
                    const updatedAt = parseDate(au.updatedAt.toISOString());
                    const completedAt = parseDate(au.completedAt.toISOString());
                    const sameUserCheck = !(userIdMonthMapping.find((u) => u.userId === au.userId && u.date === date.getDate()));
                    if (
                        updatedAt.toISOString() === date.toISOString() ||
                        completedAt.toISOString() === date.toISOString()
                    ) {
                        userIdMonthMapping.push({ date: date.getDate(), userId: au.userId });
                    }
                    return sameUserCheck && updatedAt.toISOString() === date.toISOString() ||
                        completedAt.toISOString() === date.toISOString()

                }).length;
                activeUsersObj.value += activeUsersSavedItems.filter((au) => {
                    const userInProgressData = activeUsersProgress.find((aup) => aup.userId === au.userId);
                    const updatedAt = parseDate(au.updatedAt.toISOString());
                    const createdAt = parseDate(au.createdAt.toISOString());
                    const sameUserCheck = !(userIdMonthMapping.find((u) => u.userId === au.userId && u.date === date.getDate()));
                    return (!userInProgressData) && sameUserCheck && (updatedAt === date || createdAt === date)
                }).length;
                activeUsersCount.push(activeUsersObj);
            }
            totalActiveUsers = activeUsersCount.reduce((total, currValue) => {
                return (total + currValue.value)
            }, 0);
            return { totalActiveUsers, graphData: activeUsersCount };
        } else if (filter === "WEEKLY") {
            const weekDates = [];
            let day = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            let date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDate();
            const daysInMonth = dayjs().daysInMonth();
            let remainingDays = daysInMonth;
            while (remainingDays >= 7) {
                const endDate = (day === 1) ? date + 6 : date + (7 - day);
                weekDates.push({ startDate: date, endDate });
                date = endDate + 1;
                day = 1;
                remainingDays = daysInMonth - date;
            }
            if (remainingDays > 0) {
                weekDates.push({ startDate: date, endDate: daysInMonth });
            }
            let activeUsersProgressQuery: any = {
                where: {
                    OR: {
                        updatedAt: {
                            gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                            lte: new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth, 23, 59, 59)
                        },
                        completedAt: {
                            gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                            lte: new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth, 23, 59, 59)
                        }
                    }
                }
            };
            let activeUsersSavedItemsQuery: any = {
                where: {
                    OR: {
                        updatedAt: {
                            gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                            lte: new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth)
                        },
                        createdAt: {
                            gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                            lte: new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth)
                        }
                    }
                }
            };
            if (airlineId) {
                activeUsersSavedItemsQuery.where.user = {
                    airlineId
                };
                activeUsersProgressQuery.where.user = {
                    airlineId
                };
            }
            let activeUsersProgress = await prisma.lessonProgress.findMany(activeUsersProgressQuery);
            let activeUsersSavedItems = await prisma.savedItems.findMany(activeUsersSavedItemsQuery);
            const activeUsersCount: { startDate: string, endDate: string, value: number }[] = [];
            const userIdMonthMapping: { week: number, userId }[] = [];
            weekDates.forEach((wd, i) => {
                const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), wd.startDate);
                const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), wd.endDate, 23, 59, 59);
                let value = activeUsersProgress.filter((au) => {
                    const sameUserCheck = !(userIdMonthMapping.find((u) => u.userId === au.userId && u.week === i));
                    if (
                        (au.updatedAt >= startDate && au.updatedAt <= endDate) ||
                        (au.createdAt >= startDate && au.createdAt <= endDate)
                    ) {
                        userIdMonthMapping.push({ week: i, userId: au.userId });
                    }
                    return sameUserCheck && (au.updatedAt >= startDate && au.updatedAt <= endDate) || (au.completedAt >= startDate && au.completedAt <= endDate)
                }).length;
                value += activeUsersSavedItems.filter((au) => {
                    const userInProgressData = activeUsersProgress.find((aup) => aup.userId === au.userId);
                    const sameUserCheck = !(userIdMonthMapping.find((u) => u.userId === au.userId && u.week === i));
                    if (
                        (au.updatedAt >= startDate && au.updatedAt <= endDate) ||
                        (au.createdAt >= startDate && au.createdAt <= endDate)
                    ) {
                        userIdMonthMapping.push({ week: i, userId: au.userId });
                    }
                    return (!userInProgressData) && sameUserCheck &&
                        (au.updatedAt >= startDate && au.updatedAt <= endDate) ||
                        (au.createdAt >= startDate && au.createdAt <= endDate)
                }).length;
                activeUsersCount.push({
                    startDate: dayjs(startDate).format("YYYY/MM/DD"),
                    endDate: dayjs(endDate).format("YYYY/MM/DD"),
                    value
                });
            });
            totalActiveUsers = activeUsersCount.reduce((total, currValue) => {
                return (total + currValue.value)
            }, 0);
            return { totalActiveUsers, graphData: activeUsersCount };
        } else if (filter === "MONTHLY") {
            let activeUsersProgressQuery: any = {
                where: {
                    OR: {
                        updatedAt: {
                            gte: new Date(currentDate.getFullYear(), 0, 1),
                            lte: new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59)
                        },
                        completedAt: {
                            gte: new Date(currentDate.getFullYear(), 0, 1),
                            lte: new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59)
                        }
                    }
                },
            };
            let activeUsersSavedItemsQuery: any = {
                where: {
                    OR: {
                        updatedAt: {
                            gte: new Date(currentDate.getFullYear(), 0, 1),
                            lte: new Date(currentDate.getFullYear(), 11, 31)
                        },
                        createdAt: {
                            gte: new Date(currentDate.getFullYear(), 0, 1),
                            lte: new Date(currentDate.getFullYear(), 11, 31)
                        }
                    }
                },
            };
            if (airlineId) {
                activeUsersSavedItemsQuery.where.user = {
                    airlineId
                };
                activeUsersProgressQuery.where.user = {
                    airlineId
                };
            }
            let activeUsersProgress = await prisma.lessonProgress.findMany(activeUsersProgressQuery);
            let activeUsersSavedItems = await prisma.savedItems.findMany(activeUsersSavedItemsQuery);
            const activeUsersCount: { month: number, value: number }[] = [];
            for (let month = 0; month <= 11; month++) {
                const daysInMonth = dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)).daysInMonth();
                const monthStart = new Date(currentDate.getFullYear(), month, 1);
                const monthEnd = new Date(currentDate.getFullYear(), month, daysInMonth, 23, 59, 59);
                const userIdMonthMapping: { month: number, userId }[] = [];
                let value = activeUsersProgress.filter((au) => {
                    const sameUserCheck = !(userIdMonthMapping.find((u) => u.userId === au.userId && u.month === month));
                    if (
                        (au.updatedAt >= monthStart && au.updatedAt <= monthEnd) ||
                        (au.completedAt >= monthStart && au.completedAt <= monthEnd)
                    ) {
                        userIdMonthMapping.push({ month, userId: au.userId });
                    }
                    return sameUserCheck && ((au.updatedAt >= monthStart && au.updatedAt <= monthEnd) || (au.completedAt >= monthStart && au.completedAt <= monthEnd))
                }).length;
                value += activeUsersSavedItems.filter((au) => {
                    const userInProgressData = activeUsersProgress.find((aup) => aup.userId === au.userId);
                    const sameUserCheck = !(userIdMonthMapping.find((u) => u.userId === au.userId && u.month === month));
                    if (
                        (au.updatedAt >= monthStart && au.updatedAt <= monthEnd) ||
                        (au.createdAt >= monthStart && au.createdAt <= monthEnd)
                    ) {
                        userIdMonthMapping.push({ month, userId: au.userId });
                    }
                    return (!userInProgressData) && sameUserCheck &&
                        (
                            (au.updatedAt >= monthStart && au.updatedAt <= monthEnd) ||
                            (au.createdAt >= monthStart && au.createdAt <= monthEnd)
                        )
                }).length;
                activeUsersCount.push({
                    month: month + 1,
                    value
                });
            }
            totalActiveUsers = activeUsersCount.reduce((total, currValue) => {
                return (total + currValue.value)
            }, 0);
            return { totalActiveUsers, graphData: activeUsersCount };
        }
    }

    @Query(() => [UsersDataResponse])
    @UseMiddleware(AdminAuth)
    async getNewSignups(
        @Arg("filter") filter: "DAILY" | "WEEKLY" | "MONTHLY",
        @Arg("airlineId", { nullable: true }) airlineId: string 
    ): Promise<UsersDataResponse[]> {
        const currentDate = new Date();
        if (filter === "DAILY") {
            const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
            const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));
            let newSignupsQuery: any = {
                where: {
                    createdAt: {
                        gte: firstDayOfWeek,
                        lte: lastDayOfWeek
                    }
                }
            };
            if (airlineId) {
                newSignupsQuery.where = {
                    createdAt: {
                        gte: firstDayOfWeek,
                        lte: lastDayOfWeek
                    },
                    airlineId
                };
            }
            const newSignups = await prisma.user.findMany(newSignupsQuery);
            const newSignupsCount: { date: string, value: number }[] = [];
            for (let i = 0; i < dayjs(lastDayOfWeek).diff(dayjs(firstDayOfWeek), "days") + 1; i++) {
                const date = parseDate(dayjs(firstDayOfWeek).add(i, "day").toISOString());
                let newSignupsObj: { date: string, value: number } = { date: null, value: null };
                newSignupsObj.date = dayjs(date).format("YYYY/MM/DD");
                newSignupsObj.value = newSignups.filter((ns) => {
                    const createdAt = parseDate(ns.createdAt.toISOString());
                    return createdAt.toISOString() === date.toISOString();
                }).length;
                newSignupsCount.push(newSignupsObj);
            }
            return newSignupsCount;
        } else if (filter === "WEEKLY") {
            const weekDates = [];
            let day = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            let date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDate();
            const daysInMonth = dayjs().daysInMonth();
            let remainingDays = daysInMonth;
            while (remainingDays >= 7) {
                const endDate = (day === 1) ? date + 6 : date + (7 - day);
                weekDates.push({ startDate: date, endDate });
                date = endDate + 1;
                day = 1;
                remainingDays = daysInMonth - date;
            }
            if (remainingDays > 0) {
                weekDates.push({ startDate: date, endDate: daysInMonth });
            }
            let newSignupsQuery: any = {
                where: {
                    createdAt: {
                        gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                        lte: new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth, 23, 59, 59)
                    }
                }
            };
            if (airlineId) {
                newSignupsQuery.where = {
                    createdAt: {
                        gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                        lte: new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth, 23, 59, 59)
                    },
                    airlineId
                };
            }
            const newSignups = await prisma.user.findMany(newSignupsQuery);
            const newSignupsCount: { startDate: string, endDate: string, value: number }[] = [];
            weekDates.forEach((wd, i) => {
                const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), wd.startDate);
                const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), wd.endDate, 23, 59, 59);
                let value = newSignups.filter((ns) => {
                    return ns.createdAt >= startDate && ns.createdAt <= endDate
                }).length;
                newSignupsCount.push({
                    startDate: dayjs(startDate).format("YYYY/MM/DD"),
                    endDate: dayjs(endDate).format("YYYY/MM/DD"),
                    value
                });
            });
            return newSignupsCount;
        } else if (filter === "MONTHLY") {
            let newSignupsQuery: any = {
                where: {
                    createdAt: {
                        gte: new Date(currentDate.getFullYear(), 0, 1),
                        lte: new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59)
                    }
                }
            };
            if (airlineId) {
                newSignupsQuery.where = {
                    createdAt: {
                        gte: new Date(currentDate.getFullYear(), 0, 1),
                        lte: new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59)
                    },
                    airlineId
                };
            }
            const newSignups = await prisma.user.findMany(newSignupsQuery);
            const newSignupsCount: { month: number, value: number }[] = [];
            for (let month = 0; month <= 11; month++) {
                const daysInMonth = dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)).daysInMonth();
                const monthStart = new Date(currentDate.getFullYear(), month, 1);
                const monthEnd = new Date(currentDate.getFullYear(), month, daysInMonth, 23, 59, 59);
                let value = newSignups.filter((ns) => {
                    return ns.createdAt >= monthStart && ns.createdAt <= monthEnd
                }).length;
                newSignupsCount.push({
                    month: month + 1,
                    value
                });
            }

            return newSignupsCount;
        }
    }

    @Query(() => FullCertifiedDataResponse)
    @UseMiddleware(AdminAuth)
    async getFullyCertifiedData(
        @Arg("airlineId", { nullable: true }) airlineId: string
    ): Promise<FullCertifiedDataResponse> {
        let totalUsersQuery: any = {
            where: {
                enabled: true
            }
        };

        if (airlineId) {
            totalUsersQuery.where = {
                enabled: true,
                airlineId
            }
        }
        const totalUsers = await prisma.user.findMany(totalUsersQuery);

        const certifiedUsers = await prisma.certificate.findMany({
            where: {
                userId: {
                    in: totalUsers.map(u => u.id)
                }
            },
            distinct: "userId"
        });

        const uncertifiedUsers = totalUsers.length - certifiedUsers.length;

        return { certifiedUsers: certifiedUsers.length, uncertifiedUsers, totalUsers: totalUsers.length }
    }

    @Query(() => CoursesDataResponse)
    @UseMiddleware(AdminAuth)
    async getCoursesReportData(
        @Arg("lessonId", { nullable: true }) lessonId: string,
        @Arg("airlineId", { nullable: true }) airlineId: string 
    ): Promise<CoursesDataResponse> {
        const _allCoursesQuery: any = {
            select: {
                id: true
            },
            where: {
                enabled: true
            }
        };
        if (lessonId) {
            _allCoursesQuery.where = {
                id: lessonId,
                enabled: true
            }
        }
        let totalNumberOfUsersQuery: any = {
            where: {
                enabled: true
            }
        };
        if (airlineId) {
            totalNumberOfUsersQuery.where = {
                enabled: true,
                airlineId
            }
        }
        const totalNumberOfUsers = await prisma.user.count(totalNumberOfUsersQuery);
        const _allCourses = await prisma.lesson.findMany(_allCoursesQuery);
        let coursesNotCompletedQuery: any = {
            where: {
                lessonId: {
                    in: _allCourses.map(c => c.id)
                },
                user: {
                    enabled: true
                },
                completed: false
            }
        };
        if (airlineId) {
            coursesNotCompletedQuery.where = {
                lessonId: {
                    in: _allCourses.map(c => c.id)
                },
                user: {
                    enabled: true,
                    airlineId
                },
                completed: false
            }
        }
        let coursesNotCompleted = (await prisma.lessonProgress.findMany(coursesNotCompletedQuery)).length;

        let _allCourseProgressIdsQuery: any;
        if(lessonId) {
            if (airlineId) {
                _allCourseProgressIdsQuery = {
                    select: {
                        lessonId: true
                    },
                    where: {
                        lessonId,
                        user: {
                            enabled: true,
                            airlineId
                        }
                    },
                    distinct: "lessonId"
                }
            } else {
                _allCourseProgressIdsQuery = {
                    select: {
                        lessonId: true
                    },
                    where: {
                        lessonId,
                        user: {
                            enabled: true
                        }
                    },
                    distinct: "lessonId"
                }
            }
        } else {
            if (airlineId) {
                _allCourseProgressIdsQuery = {
                    where: {
                        user: {
                            enabled: true,
                            airlineId
                        }
                    },
                    select: {
                        lessonId: true
                    },
                    distinct: "lessonId"
                }
            } else {
                _allCourseProgressIdsQuery = {
                    where: {
                        user: {
                            enabled: true
                        }
                    },
                    select: {
                        lessonId: true
                    },
                    distinct: "lessonId"
                }
            }
        }

        const _allCourseProgressIds = await prisma.lessonProgress.findMany(_allCourseProgressIdsQuery)

        let coursesNotStarted = (await prisma.lesson.findMany({
            where: {
                id: {
                    notIn: _allCourseProgressIds.map(p => p.lessonId)
                },
                enabled: true
            }
        })).length;

        let _coursesCompletedQuery: any;
        if (lessonId) {
            if (airlineId) {
                _coursesCompletedQuery = {
                    where: {
                        user: {
                            enabled: true,
                            airlineId
                        },
                        lessonId,
                        completed: true,
                    }
                }
            } else {
                _coursesCompletedQuery = {
                    where: {
                        user: {
                            enabled: true
                        },
                        lessonId,
                        completed: true,
                    }
                }
            }
        } else {
            if (airlineId) {
                _coursesCompletedQuery = {
                    where: {
                        user: {
                            enabled: true,
                            airlineId
                        },
                        completed: true,
                    }
                }
            } else {
                _coursesCompletedQuery = {
                    where: {
                        user: {
                            enabled: true
                        },
                        completed: true,
                    }
                }
            }
        }

        const coursesCompleted = (await prisma.lessonProgress.findMany(_coursesCompletedQuery)).length;

        coursesNotStarted = (totalNumberOfUsers * _allCourses.length) - (coursesCompleted + coursesNotCompleted);

        return { coursesCompleted, coursesNotStarted, coursesNotCompleted }
    }

    @Query(() => [CourseCompletionRateResponse])
    @UseMiddleware(AdminAuth)
    async getCourseCompletionReport(
        @Arg("airlineId", { nullable: true }) airlineId: string
    ): Promise<CourseCompletionRateResponse[]> {
        const _allCourses = await prisma.lesson.findMany({
            select: {
                id: true,
                title: true
            },
            where: {
                enabled: true
            }
        });

        let coursesProgressQuery: any = {
            where: {
                lessonId: {
                    in: _allCourses.map(c => c.id)
                },
                completed: true,
                user: {
                    enabled: true
                }
            }
        };

        if (airlineId) {
            coursesProgressQuery.where = {
                lessonId: {
                    in: _allCourses.map(c => c.id)
                },
                completed: true,
                user: {
                    enabled: true,
                    airlineId
                }
            };
        }
        
        let coursesProgress = await prisma.lessonProgress.findMany();

        const courseCompletionRateData: { courseTitle: string, completions: number }[] = []
        
        for (const course of _allCourses) {
            let courseCompletionDataObj: { courseTitle: string, completions: number } = { courseTitle: "", completions: 0};
            courseCompletionDataObj.courseTitle = course.title;
            courseCompletionDataObj.completions = coursesProgress.filter(c => c.lessonId === course.id).length;
            courseCompletionRateData.push(courseCompletionDataObj);
        }

        return courseCompletionRateData;
    }
}