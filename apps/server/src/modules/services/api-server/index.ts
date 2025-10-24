import express from "express";
import { urlencoded } from "body-parser";
import {
    API_PORT,
    CLIENT_URL,
    CORS_CONFIG,
    OATH_TOKEN_URL,
    OAUTH_AUTHORIZE_URL,
    OAUTH_CALLBACK_URL,
    PROFILE_API_URL,
} from "../../../config/global";
import { PrismaClient, airline } from "orm/generated";
import apolloServer from "../../apollo";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import axios from "axios";
import FormData from "form-data";
import prisma from "orm";
import { equal } from "assert";
import { apiLimiter, authLimiter } from "../../middleware/rate-limit";

const app = express();
app.use(cors(CORS_CONFIG));

// Apply general rate limiting to all API routes
app.use(apiLimiter);

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());


async function connectPrisma() {
    const prisma = new PrismaClient();
    await prisma.$connect();
}

app.use("/static",
    express.static(
        path.join(__dirname, "../../../../../client/dist/index.js")
    )
);

app.get("/sso", authLimiter, async (req, res) => {
    try {
        const code = req.query.code;
        console.log("🚀 ~ app.get ~ req.query.code:", req.query.code)
        const form = new FormData();
        form.append("grant_type", "authorization_code");
        form.append("type", "web_server");
        form.append("client_id", process.env.OATH_CLIENT_ID);
        form.append("client_secret", process.env.OATH_CLIENT_SECRET);
        form.append("redirect_uri", OAUTH_CALLBACK_URL);
        form.append("code", code.toString());
        const response = await axios.post(OATH_TOKEN_URL, form, { 
            headers: { 
                'Content-Type': `multipart/form-data`, 
            } 
        });
        const profileResponse = await axios.get(PROFILE_API_URL, {
            headers: {
                "Authorization": `Bearer ${response.data.access_token}`
            }
        });
        console.log("🚀 ~ app.get ~ profileResponse:", profileResponse.data);
        const _userSSOProfileData = profileResponse.data;
        const _userExists = await prisma.user.findFirst({
            where: {
                email: {
                    equals: _userSSOProfileData.Email,
                    mode: "insensitive"
                }
            }
        });
        let airline: airline;
            if (!_userExists) {
                if (_userSSOProfileData?.AirlineCode) {
                    airline = await prisma.airline.findFirst({
                        where: {
                            code: _userSSOProfileData.AirlineCode
                        }
                    });
                    if (!airline) {
                        airline = await prisma.airline.findFirst({
                            where: {
                                code: "OT"
                            }
                        });
                    }
                    await prisma.user.create({
                        data: {
                            email: _userSSOProfileData.Email.toLowerCase(),
                            firstName: _userSSOProfileData.FirstName,
                            lastName: _userSSOProfileData.LastName,
                            avatar: "",
                            airlineId: airline.id,
                            ssoLogin: true
                        },
                    });
                } else {
                    airline = await prisma.airline.findFirst({
                        where: {
                            code: "OT"
                        }
                    });
                    await prisma.user.create({
                        data: {
                            email: _userSSOProfileData.Email,
                            firstName: _userSSOProfileData.FirstName,
                            lastName: _userSSOProfileData.LastName,
                            avatar: "",
                            airlineId: airline.id,
                            ssoLogin: true
                        },
                    });
                }
            }
        res.redirect(`${CLIENT_URL}/user/sign-in?sso=1&email=${Buffer.from(_userSSOProfileData.Email).toString("base64")}&newUser=${!_userExists}`);
    } catch(err) {
        console.log("🚀 ~ app.get ~ err:", err)
        res.redirect(`${CLIENT_URL}/user/sign-in?sso=0`);
    }
});

connectPrisma().catch(console.error);
const apiServer = (cb: () => void = () => { }) => {
    apolloServer(app)
        .then(() => {
            console.log("GraphQL Loaded");
            app.listen(API_PORT, () => {
                console.log(`🚀 API Server Started`,API_PORT);
                cb();
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export default apiServer;
