import express from "express";
import {
  CORS_CONFIG,
  GRAPHQL_URL,
} from "../../config/global";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { graphqlRateLimitPlugin } from "../middleware/graphql-rate-limit";
import { buildSchema, Query, Resolver } from "orm";

import {
  GraphQLUpload,
  graphqlUploadExpress,
} from "graphql-upload";
import AdminAuthResolver from "@graphql/admin/auth";
import AdminCourseResolver from "@graphql/admin/course";
import AdminUserResolver from "@graphql/admin/user";
import PublicAuthResolver from "@graphql/public/auth";
import PublicCertificateResolver from "@graphql/public/certificate";
import PublicDashboardResolver from "@graphql/public/dashboard";
import PublicFavoritesResolver from "@graphql/public/favorites";
import NotificationResolver from "@graphql/admin/notification";
import { AdminDashboardResolver } from "@graphql/admin/dashboard/dashboard";
import PublicSettingsResolver from "@graphql/public/settings";
import AdminMediaResolver from "@graphql/admin/media";
import PublicNotificationResolver from "@graphql/public/notification";
import AdminNotificationResolver from "@graphql/admin/notification";
import ReportsResolver from "@graphql/admin/reports";
import AdminCertificationResolver from "@graphql/admin/certification";

@Resolver()
class PublicTest {
  @Query(() => String)
  async test() {
    return "test";
  }
}
const apolloServer = (app: express.Application) => {
  return new Promise((resolve, reject) => {
    buildSchema({
      resolvers: [
        PublicTest,
        AdminAuthResolver,
        AdminCourseResolver,
        AdminUserResolver,
        NotificationResolver,
        AdminDashboardResolver,
        PublicAuthResolver,
        PublicDashboardResolver,
        PublicCertificateResolver,
        PublicFavoritesResolver,
        AdminMediaResolver,
        AdminNotificationResolver,
        PublicAuthResolver,
        PublicDashboardResolver,
        PublicCertificateResolver,
        PublicNotificationResolver,
        PublicFavoritesResolver,
        PublicSettingsResolver,
        ReportsResolver,
        AdminCertificationResolver
      ],
      validate: false,
    })
      .then((schema) => {
        const server = new ApolloServer({
          schema: schema as any,
          resolvers: {
            Upload: GraphQLUpload,
          },
          context({ res, req }) {
            return { res, req };
          },
          plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground,
            graphqlRateLimitPlugin(),
          ],
        });

        server
          .start()
          .then(() => {
            app.use(GRAPHQL_URL, graphqlUploadExpress());
            server.applyMiddleware({
              app,
              path: GRAPHQL_URL,
              cors: CORS_CONFIG,
            });
            resolve(true);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default apolloServer;
