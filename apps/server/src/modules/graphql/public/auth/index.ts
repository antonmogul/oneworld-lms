import { COOKIE_PREFIX } from "@config/global";
import { generateToken, verifyToken } from "@services/JWT";
import tokenGenerator from "@services/auth/token-generator";
import { emailTemplates, sendEmailWithTemplate } from "@services/email-service";
import { hashString, isSameHash } from "@services/hash";
import otpGenerator from "@services/otp-generator";
import { maskEmail } from "@utils/common-functions";
import dayjs from "dayjs";
import prisma, { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "orm";
import { OTPType } from "orm/generated";
import { ContextType } from "types/ContextType";

@ObjectType()
export class PublicLoginResponse {
    @Field(() => String, {
        nullable: true
    })
    id?: string;
    @Field(() => String, {
        nullable: true
    })
    token?: string;
    @Field(() => String, {
        nullable: true
    })
    firstName?: string;
    @Field(() => String, {
        nullable: true
    })
    lastName?: string;
    @Field(() => String)
    message: string
}

@Resolver()
export default class PublicAuthResolver {
    @Mutation(() => PublicLoginResponse)
    async publicLogin(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx: ContextType
    ): Promise<PublicLoginResponse> {
        email = email.toLowerCase();
        let cookie2FA = ctx.req.cookies["@ow-2FA"];
        let cookieData: {
            id: string,
            version: number,
            refreshToken: boolean,
            rememberMe: boolean,
            type: string,
            iat: number,
            exp: number
        }, isCookie: boolean;

        if (cookie2FA) {
            cookieData = verifyToken<{
                id: string,
                version: number,
                refreshToken: boolean,
                rememberMe: boolean,
                type: string,
                iat: number,
                exp: number
            }>(cookie2FA);
            isCookie = true;
        } else {
            isCookie = false
        }
        if (!email) {
            throw new Error("Invalid email!");
        } else {
            const emailValidationRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!emailValidationRegex.test(email)) {
                throw new Error("Invalid email!");
            }
        }
        if (!password) {
            throw new Error("Invalid password!");
        }
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            throw new Error("Invalid email!");
        }

        const isSamePassword = await isSameHash(
            password,
            user.password
        );
        if (!isSamePassword) {
            throw new Error("Invalid email or password");
        }
        if (isCookie && cookieData.rememberMe && cookieData.id === user.id) {
            const { token } = tokenGenerator(
                "user",
                {
                    id: user.id,
                    version: user.tokenVersion
                },
                ctx.res
            );

            return {
                token,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.id,
                message: ""
            }
        } else {
            return this.publicResendLoginOTP(user.email, OTPType.LOGIN);
        }
    }
    
    @Mutation(() => PublicLoginResponse)
    async publicLoginSSO(
        @Arg("email") email: string,
        @Ctx() ctx: ContextType
    ): Promise<PublicLoginResponse> {
        email = email.toLowerCase();
        console.log("🚀 ~ PublicAuthResolver ~ email:", email)
        if (!email) {
            console.log("invalid email!");
            throw new Error("Invalid email!");
        }
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive"
                }
            },
        });

        if (!user) {
            console.log("invalid email!");
            throw new Error("Invalid email!");
        }
        
        const { token } = tokenGenerator(
            "user",
            {
                id: user.id,
                version: user.tokenVersion
            },
            ctx.res
        );

        return {
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
            message: ""
        }   
    }

    @Mutation(() => PublicLoginResponse)
    async publicSignup(
        @Arg("email") email: string,
        @Arg("firstName") firstName: string,
        @Arg("lastName") lastName: string,
        @Arg("password") password: string
    ): Promise<PublicLoginResponse> {
        email = email.toLowerCase();
        if (!email) {
            throw new Error("Invalid email!");
        } else {
            const emailValidationRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!emailValidationRegex.test(email)) {
                throw new Error("Invalid email!");
            }
        }
        if (!firstName) {
            throw new Error("Invalid firstname!");
        }
        if (!lastName) {
            throw new Error("Invalid lastname!");
        }
        if (!password) {
            throw new Error("Invalid password!");
        }
        const emailExist = await prisma.user.count({
            where: {
                email
            }
        });
        if (emailExist) {
            throw new Error("The username and/or password are incorrect!");
        }
        let airline;

        airline = await prisma.airline.findFirst({
            where: {
                code: "OT"
            }
        });

        let hashedPassword = await hashString(password);
        const _newUser = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                password: hashedPassword,
                avatar: "",
                airlineId: airline.id
            },
        });

        return this.publicResendLoginOTP(_newUser.email, OTPType.SIGNUP);
    }

    @Mutation(() => PublicLoginResponse)
    async publicResendLoginOTP(
        @Arg("email") email: string,
        @Arg("OTPType") OTPType: OTPType
    ): Promise<PublicLoginResponse> {
        try {
            email = email.toLowerCase();
            const user = await prisma.user.findFirst({
                where: {
                    email,
                },
            });
    
            if (user) {
                const OTP = otpGenerator();
                await prisma.oTP.create({
                    data: {
                        otp: OTP,
                        userId: user.id,
                        isUsed: false,
                        type: OTPType,
                    },
                });
    
                await sendEmailWithTemplate(user.email, emailTemplates.VERIFICATION_OTP, {
                    email: user.email,
                    otp: OTP
                });
                console.log("🚀 ~ PublicAuthResolver ~ OTP:", OTP)
    
                return { message: `OTP has been sent to ${maskEmail(email)}` };
            } else {
                throw new Error(
                    "Unable to locate user with given email."
                );
            }
        } catch(err) {
            throw new Error(
                err.message
            );
        }
    }

    @Mutation(() => PublicLoginResponse)
    async verifySignupOTP(
        @Arg("email") email: string,
        @Arg("otp") otp: string,
        @Arg("rememberMe") rememberMe: boolean,
        @Ctx() ctx: ContextType
    ): Promise<PublicLoginResponse> {
        email = email.toLowerCase();
        if (!email) {
            throw new Error("Please enter valid email!");
        }
        if (!otp) {
            throw new Error("Please enter valid OTP!");
        }

        return this.verifyOTP(otp, email, OTPType.SIGNUP, ctx, rememberMe);
    }

    @Mutation(() => PublicLoginResponse)
    async verifyLoginOTP(
        @Arg("email") email: string,
        @Arg("otp") otp: string,
        @Arg("rememberMe") rememberMe: boolean,
        @Ctx() ctx: ContextType
    ): Promise<PublicLoginResponse> {
        email = email.toLowerCase();
        if (!email) {
            throw new Error("Please enter valid email!");
        }
        if (!otp) {
            throw new Error("Please enter valid OTP!");
        }

        return this.verifyOTP(otp, email, OTPType.LOGIN, ctx, rememberMe);
    }

    async verifyOTP(
        otp: string,
        email: string,
        otpType: OTPType,
        ctx: ContextType,
        rememberMe: boolean
    ) {
        email = email.toLowerCase();
        const user = await prisma.user.findFirst({
            where: {
                email,
                enabled: true
            },
        });

        const otpRequest = await prisma.oTP.findFirst({
            where: {
                otp,
                userId: user.id,
                isUsed: false,
                created_at: {
                    gte: dayjs().subtract(90, "minutes").toDate(),
                    lt: dayjs().toDate()
                },
                type: otpType,
            },
        });

        const { token } = tokenGenerator(
            "user",
            {
                id: user.id,
                version: user.tokenVersion
            },
            ctx.res
        );

        if (rememberMe) {
            const tokens2FA = tokenGenerator(
                "user",
                {
                    id: user.id,
                    rememberMe: true,
                    version: user.tokenVersion
                }
            );
            ctx.res.cookie(
                `${COOKIE_PREFIX}-2FA`,
                tokens2FA.token,
                {
                    httpOnly: true,
                    expires: dayjs().add(30, "days").toDate(),
                    secure: true,
                    sameSite: "none",
                }
            );
        }

        if (!otpRequest) {
            throw new Error("Invalid OTP! Please try again.");
        }

        await prisma.oTP.update({
            where: {
                id: otpRequest.id
            },
            data: {
                isUsed: true
            }
        });

        if (otpType === "SIGNUP") {
            await sendEmailWithTemplate(user.email, emailTemplates.WELCOME_EMAIL_2, {
                email: user.email,
                name: `${user.firstName} ${user.lastName}`
            });
        }

        return {
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
            message: ""
        }
    }

    @Mutation(() => Boolean)
    async publicForgotPassword(
        @Arg("email") email: string
    ): Promise<boolean> {
        email = email.toLowerCase();
        if (!email) {
            throw new Error("Invalid email!");
        } else {
            const emailValidationRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!emailValidationRegex.test(email)) {
                throw new Error("Invalid email!");
            }
        }
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (user) {
            const token = await generateToken({
                id: user.id,
                type: "UserResetPassword"
            });

            await sendEmailWithTemplate(user.email, emailTemplates.RESET_PASSWORD, {
                email: user.email,
                token: token
            });
        }

        return true;
    }

    @Mutation(() => Boolean)
    async publicResetPassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string
    ): Promise<boolean> {
        if (!token) {
            throw new Error("Invalid token!");
        }
        if (!newPassword) {
            throw new Error("Invalid new password!");
        }
        const tokenData = verifyToken<{
            id: string;
            type: string;
        }>(token);

        const _user = await prisma.user.findUnique({
            where: {
                id: tokenData.id
            }
        });

        if (!(_user && tokenData.type === "UserResetPassword")) {
            throw new Error("Invalid Token!");
        }

        let hashedPassword = await hashString(newPassword);
        await prisma.user.update({
            where: {
                id: _user.id,
            },
            data: {
                password: hashedPassword,
                tokenVersion: _user.tokenVersion + 1,
            }
        });

        return true;
    }
}