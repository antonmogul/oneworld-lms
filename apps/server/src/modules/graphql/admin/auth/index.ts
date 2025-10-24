import { AdminAuth } from "@middleware/admin";
import tokenGenerator from "@services/auth/token-generator";
import { hashString, isSameHash } from "@services/hash";
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
import { ContextType } from "types/ContextType";

@ObjectType()
export class AdminLoginResponse {
  @Field(() => String)
  token!: string;
  @Field(() => String)
  firstName!: string;
  @Field(() => String)
  lastName!: string;
}
@ObjectType()
export class AdminMeResponse {
  @Field(() => String)
  firstName!: string;
  @Field(() => String)
  lastName!: string;
  @Field(() => String)
  email!: string;
}

@Resolver()
export default class AdminAuthResolver {
  //TODO:temporary comment once push to staging or live
  @Mutation(() => Boolean)
  async adminCreate(
    @Arg("email") email: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("password") password: string
  ) {
    let hashedPassword = await hashString(password);
    await prisma.admin.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    return true;
  }

  @Mutation(() => AdminLoginResponse)
  async adminSignIn(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: ContextType
  ) {
    const admin = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (!admin) {
      throw new Error("Invalid email or password");
    }

    const isSamePassword = await isSameHash(
      password,
      admin.password
    );
    if (!isSamePassword) {
      throw new Error("Invalid email or password");
    }

    const { token } = tokenGenerator(
      "admin",
      {
        id: admin.id,
        version: admin.tokenVersion,
      },
      ctx.res
    );

    return {
      token,
      firstName: admin.firstName,
      lastName: admin.lastName,
    };
  }
  @Mutation(() => AdminLoginResponse)
  @UseMiddleware(AdminAuth)
  async adminChangePassword(
    @Arg("oldPassword") oldPassword: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() ctx: ContextType
  ) {
    const admin = await prisma.admin.findFirst({
      where: {
        id: ctx.user,
      },
    });

    if (!admin) {
      throw new Error("Invalid admin");
    }

    const isSamePassword = await isSameHash(
      oldPassword,
      admin.password
    );
    if (!isSamePassword) {
      throw new Error("Invalid password");
    }
    let hashedPassword = await hashString(newPassword);
    await prisma.admin.update({
      where: {
        id: admin.id,
      },
      data: {
        password: hashedPassword,
        tokenVersion: admin.tokenVersion + 1,
      },
    });

    const { token } = tokenGenerator(
      "admin",
      {
        id: admin.id,
        version: admin.tokenVersion + 1,
      },
      ctx.res
    );

    return {
      token,
      firstName: admin.firstName,
      lastName: admin.lastName,
    };
  }

  @Mutation(() => AdminLoginResponse)
  @UseMiddleware(AdminAuth)
  async adminResetPassword(
    @Arg("email") email: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() ctx: ContextType
  ) {
    const admin = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (!admin) {
      throw new Error("Invalid admin");
    }

    let hashedPassword = await hashString(newPassword);

    await prisma.admin.update({
      where: {
        id: admin.id,
      },
      data: {
        password: hashedPassword,
        tokenVersion: admin.tokenVersion + 1,
      },
    });

    return {
      message: "Password reset successfully",
    };
  }

  @Query(() => AdminMeResponse)
  @UseMiddleware(AdminAuth)
  async adminMe(@Ctx() ctx: ContextType) {
    const admin = await prisma.admin.findUnique({
      where: {
        id: ctx.user,
      },
    });

    return {
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email
    };
  }
}
