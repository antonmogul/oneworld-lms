import { PublicAuth } from "@middleware/public";
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
  SavedItems,
  savedItemType,
} from "orm/generated/type-graphql";
import { ContextType } from "types/ContextType";

@ObjectType()
class DisplayDataForSaveItem {
  @Field(() => String)
  heading: string;
  @Field(() => String)
  tag: string;
  @Field(() => String)
  footerText: string;
  @Field(() => String)
  image: string;
  @Field(() => Boolean)
  isCompleted: boolean;
  @Field(() => String)
  lessonId: string;
  @Field(() => String)
  certificateId: string;
}
@ObjectType()
class UserSaveItemResponse extends SavedItems {
  @Field(() => DisplayDataForSaveItem)
  displayData: DisplayDataForSaveItem;
}

@Resolver()
export default class PublicFavoritesResolver {
  @Query(() => [UserSaveItemResponse])
  @UseMiddleware(PublicAuth)
  async getUserSavedItems(
    @Ctx() ctx: ContextType
  ): Promise<UserSaveItemResponse[]> {
    const _savedItems = await prisma.savedItems.findMany({
      where: {
        userId: ctx.user,
      },
    });

    const _certificationIds = _savedItems
      .filter((d) => d.type === "COURSE")
      .map((d) => d.savedItemKey);

    const _certifications = await prisma.certification.findMany({
      where: {
        id: {
          in: _certificationIds,
        },
      },
      include: {
        certificate: {
          where: {
            userId: ctx.user,
          },
        },
      },
    });

    const _slideIds = _savedItems
      .filter((d) => d.type === "SLIDE")
      .map((d) => d.savedItemKey);

    const _slides = await prisma.slides.findMany({
      where: {
        id: {
          in: _slideIds,
        },
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            image: true,
            tag: true,
          },
        },
      },
    });

    const _finalSavedItem: UserSaveItemResponse[] = [];

    _savedItems.forEach((item) => {
      const data: UserSaveItemResponse = {
        ...item,
        displayData: {
          footerText: "",
          heading: "",
          image: "",
          isCompleted: false,
          tag: "",
          lessonId: "",
          certificateId:"",
        },
      };
      if (item.type === "COURSE") {
        const course = _certifications.find(
          (c) => c.id === item.savedItemKey
        );
        if (course) {
          data.displayData.lessonId = course.id;
          data.displayData.heading = course.title;
          data.displayData.image = course.image;
          // data.displayData.tag = course.tag;
          data.displayData.isCompleted =
            course.certificate.length > 0;
          data.displayData.certificateId = data.displayData.isCompleted? course.certificate[0].id : "";
          data.displayData.footerText = "";
        }
      } else {
        const slide = _slides.find(
          (c) => c.id === item.savedItemKey
        );
        if (slide) {
          const _lessonData = JSON.parse(slide.data);
          let heading = "Unknown";
          if (_lessonData && "heading" in _lessonData) {
            heading = _lessonData["heading"];
          } else if (
            _lessonData &&
            "headline" in _lessonData
          ) {
            heading = _lessonData["headline"];
          } else if (
            _lessonData &&
            "title" in _lessonData
          ) {
            heading = _lessonData["title"];
          } else {
            heading = `Lesson from ${slide.lesson.title}`;
          }
          data.displayData.lessonId = slide.lesson.id;
          data.displayData.heading = heading;
          data.displayData.image = slide.lesson.image;
          data.displayData.tag = slide.lesson.tag;
          data.displayData.isCompleted = false;
          data.displayData.footerText = slide.lesson.title;
        }
      }
      _finalSavedItem.push(data);
    });

    return _finalSavedItem;
  }

  @Mutation(() => String)
  @UseMiddleware(PublicAuth)
  async addToSave(
    @Arg("itemType", () => savedItemType)
    itemType: savedItemType,
    @Arg("itemId") itemId: string,
    @Ctx() ctx: ContextType
  ): Promise<string> {
    const savedItem =  await prisma.savedItems.create({
      data: {
        savedItemKey: itemId,
        type: itemType,
        userId: ctx.user,
      },
    });

    return savedItem.id;
  }
  @Mutation(() => Boolean)
  @UseMiddleware(PublicAuth)
  async removeFromSave(
    @Arg("saveId") saveId: string,
    @Ctx() ctx: ContextType
  ): Promise<boolean> {
    await prisma.savedItems.delete({
      where: {
        id: saveId,
      },
    });

    return true;
  }
}
