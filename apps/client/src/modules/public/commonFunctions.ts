import { publicQL } from "../../graphql";
import { GetLessonProgressDocument, StartLessonDocument } from "../../graphql/graphql";
import { courseViewPage } from "./courseView";

export const startCourse = ({ id, preview, slideId }) => {
    return new Promise((resolve, reject) => {
        const courseProgressReq = publicQL.query(GetLessonProgressDocument);
        const startCourseReq = publicQL.mutation(StartLessonDocument);
        courseProgressReq.fetch({
            lessonId: id
        }).then(data => {
            if (data) {
                courseViewPage({ id, preview, slideId });
            }
        }).catch(err => {
            if (err.message === "ApolloError: Lesson Progress not found!") {
                startCourseReq.fetch({ lessonId: id }).then((data) => {
                    if (data) {
                        courseViewPage({ id, preview, slideId });
                    }
                });
            }
        });
    });
}