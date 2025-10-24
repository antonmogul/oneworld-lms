require("dotenv").config();
import "reflect-metadata";
import apiServer from "./modules/services/api-server";
import { initializeCronJob } from "@services/schedule-jobs";

apiServer(async () => {
    initializeCronJob();
});
