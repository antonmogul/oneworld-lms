import { WFComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql"
import { UpdateUserEmailSubscriptionStatusDocument } from "../../graphql/graphql"
import { PUBLIC_PATHS } from "../../config";

export const unsubscribePage = (pageQuery: { e: string }) => {
    const updateEmailSubscriptionReq = publicQL.mutation(UpdateUserEmailSubscriptionStatusDocument);
    const reSubscribeButton = new WFComponent(`[xa-type="resubscribe-button"]`);

    updateEmailSubscriptionReq.onData((data) => {
        if (data.updateUserEmailSubscriptionStatus === null) {

        } else if (data.updateUserEmailSubscriptionStatus) {
            navigate(PUBLIC_PATHS.signIn);
        }
    });

    reSubscribeButton.on("click", () => {
        updateEmailSubscriptionReq.fetch({ email: pageQuery.e, status: true });
    });

    updateEmailSubscriptionReq.fetch({ email: pageQuery.e, status: false });
}