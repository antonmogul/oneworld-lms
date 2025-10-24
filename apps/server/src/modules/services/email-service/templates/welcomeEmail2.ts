import { CLIENT_URL } from "@config/global";

export type WelcomeEmail2Params = {
    name: string,
    email: string,
};

const WelcomeEmail2 = (
    data: WelcomeEmail2Params,
) => {
    const TextBody = `Welcome to the oneworld, ${data.name}!`;
    const Subject = `Welcome to the oneworld, ${data.name}!`;

    const HtmlBody = `
    <!DOCTYPE html>
    <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
        <title></title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
        <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            <o:AllowPNG/>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]--><!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/>
        <!--<![endif]-->
        <style>
        * {
        box-sizing: border-box;
        }
        body {
        margin: 0;
        padding: 0;
        }
        a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
        }
        #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        }
        p {
        line-height: inherit
        }
        .desktop_hide,
        .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0px;
        overflow: hidden;
        }
        .image_block img+div {
        display: none;
        }
        @media (max-width:620px) {
        .image_block img.fullWidth {
        max-width: 100% !important;
        }
        .mobile_hide {
        display: none;
        }
        .row-content {
        width: 100% !important;
        }
        .stack .column {
        width: 100%;
        display: block;
        }
        .mobile_hide {
        min-height: 0;
        max-height: 0;
        max-width: 0;
        overflow: hidden;
        font-size: 0px;
        }
        .desktop_hide,
        .desktop_hide table {
        display: table !important;
        max-height: none !important;
        }
        .row-1 .column-1 .block-1.spacer_block {
        height: 48px !important;
        }
        .row-15 .column-1 .block-1.spacer_block {
        height: 38px !important;
        }
        .row-12 .column-1,
        .row-13 .column-1,
        .row-3 .column-1 {
        padding: 0 24px !important;
        }
        .row-10 .column-1,
        .row-4 .column-1,
        .row-6 .column-1,
        .row-8 .column-1 {
        padding: 24px 24px 10px !important;
        }
        .row-10 .column-2,
        .row-11 .column-1,
        .row-4 .column-2,
        .row-5 .column-1,
        .row-6 .column-2,
        .row-7 .column-1,
        .row-8 .column-2,
        .row-9 .column-1 {
        padding: 24px !important;
        }
        }
        </style>
    </head>
    <body style="margin: 0; background-color: #f8f8f8; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
        <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;" width="100%">
        <tbody>
            <tr>
            <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <div class="spacer_block block-1" style="height:76px;line-height:76px;font-size:1px;"> </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad" style="width:100%;">
                                    <div align="center" class="alignment" style="line-height:10px"><img src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/6512e94777b4a6f925caeeb1_Email_Header.png" style="display: block; height: auto; border: 0; max-width: 600px; width: 100%;" width="600"/></div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 40px; padding-right: 40px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <div class="spacer_block block-1" style="height:40px;line-height:40px;font-size:1px;"> </div>
                                <table border="0" cellpadding="10" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <h1 style="margin: 0; color: #120c80; direction: ltr; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;">Welcome to the <strong>one</strong>world Alliance Training</h1>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-3" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div style="color:#120c80;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                        <p style="margin: 0; margin-bottom: 18px;">Hi ${data.name},</p>
                                        <p style="margin: 0;">Welcome to <strong>one</strong>world Alliance training. We're excited to have you onboard and help you achieve your goals. Things you can do:</p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-5" style="height:24px;line-height:24px;font-size:1px;"> </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4 mobile_hide" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 24px; padding-left: 40px; padding-right: 32px; padding-top: 24px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="41.666666666666664%">
                                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                    <div align="center" class="alignment" style="line-height:10px"><img alt="Course Name" class="fullWidth" src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65130aa7c5e81529f31cd82d_Training.jpg" style="display: block; height: auto; border: 0; max-width: 178px; width: 100%;" title="Course Name" width="178"/></div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 48px; padding-right: 40px; padding-top: 48px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="58.333333333333336%">
                                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad" style="text-align:center;width:100%;">
                                    <h3 style="margin: 0; color: #120c80; direction: ltr; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;">Training</h3>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-2" style="height:16px;line-height:16px;font-size:1px;"> </div>
                                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div style="color:#120c80;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                        <p style="margin: 0;">On a mobile phone or computer, complete your training by taking courses which are comprised of a lesson and a short quiz at the end.</p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5 mobile_hide" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 40px; padding-right: 40px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div align="center" class="alignment">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                        <tr>
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #0000001a;"><span> </span></td>
                                        </tr>
                                        </table>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-2" style="height:16px;line-height:16px;font-size:1px;"> </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6 mobile_hide" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 24px; padding-left: 40px; padding-right: 32px; padding-top: 24px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="41.666666666666664%">
                                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                    <div align="center" class="alignment" style="line-height:10px"><img alt="Course Name" class="fullWidth" src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65130aa79cb19579dec68315_Save.jpg" style="display: block; height: auto; border: 0; max-width: 178px; width: 100%;" title="Course Name" width="178"/></div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 48px; padding-right: 40px; padding-top: 48px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="58.333333333333336%">
                                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad" style="text-align:center;width:100%;">
                                    <h3 style="margin: 0; color: #120c80; direction: ltr; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;">Save</h3>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-2" style="height:16px;line-height:16px;font-size:1px;"> </div>
                                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div style="color:#120c80;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                        <p style="margin: 0;">Want to save something for later? Save any content from a lesson you want for quick access in the future.</p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7 mobile_hide" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 40px; padding-right: 40px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div align="center" class="alignment">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                        <tr>
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #0000001a;"><span> </span></td>
                                        </tr>
                                        </table>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-2" style="height:16px;line-height:16px;font-size:1px;"> </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8 mobile_hide" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 24px; padding-left: 40px; padding-right: 32px; padding-top: 24px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="41.666666666666664%">
                                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                    <div align="center" class="alignment" style="line-height:10px"><img alt="Course Name" class="fullWidth" src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65130aa770bd2d2f90739346_GetCertified.jpg" style="display: block; height: auto; border: 0; max-width: 178px; width: 100%;" title="Course Name" width="178"/></div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 48px; padding-right: 40px; padding-top: 48px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="58.333333333333336%">
                                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad" style="text-align:center;width:100%;">
                                    <h3 style="margin: 0; color: #120c80; direction: ltr; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;">Get Certified</h3>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-2" style="height:16px;line-height:16px;font-size:1px;"> </div>
                                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div style="color:#120c80;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                        <p style="margin: 0;">Get certified and review a set of concise course highlights to help refresh your memory.</p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9 mobile_hide" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 40px; padding-right: 40px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div align="center" class="alignment">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                        <tr>
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #0000001a;"><span> </span></td>
                                        </tr>
                                        </table>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-2" style="height:16px;line-height:16px;font-size:1px;"> </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-10 mobile_hide" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 24px; padding-left: 40px; padding-right: 32px; padding-top: 24px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="41.666666666666664%">
                                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                    <div align="center" class="alignment" style="line-height:10px"><img alt="Course Name" class="fullWidth" src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65130aa74bd33c2293402dd9_Notifications.jpg" style="display: block; height: auto; border: 0; max-width: 178px; width: 100%;" title="Course Name" width="178"/></div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 48px; padding-right: 40px; padding-top: 48px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="58.333333333333336%">
                                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad" style="text-align:center;width:100%;">
                                    <h3 style="margin: 0; color: #120c80; direction: ltr; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;">Notifications</h3>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-2" style="height:16px;line-height:16px;font-size:1px;"> </div>
                                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div style="color:#120c80;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                        <p style="margin: 0;">Stay informed with <strong>one</strong>world news and system notifications about course updates or site maintenance. (?) Our training by taking courses which are comprised of a lesson and a short quiz at the end.</p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-11 mobile_hide" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 40px; padding-right: 40px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div align="center" class="alignment">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                        <tr>
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #0000001a;"><span> </span></td>
                                        </tr>
                                        </table>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-2" style="height:16px;line-height:16px;font-size:1px;"> </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 40px; padding-right: 40px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <div class="spacer_block block-1" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                <table border="0" cellpadding="10" cellspacing="0" class="button_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div align="center" class="alignment">
                                        <!--[if mso]>
                                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:48px;width:134px;v-text-anchor:middle;" arcsize="125%" stroke="false" fillcolor="#120c80">
                                        <w:anchorlock/>
                                        <v:textbox inset="0px,0px,0px,0px">
                                            <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px">
                                            <![endif]-->
                                            <a href="${CLIENT_URL}/user/dashboard/main">
                                                <div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#120c80;border-radius:60px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:8px;padding-bottom:8px;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:25px;padding-right:25px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Get Started</span></span></div>
                                                <!--[if mso]>
                                            </center>
                                        </v:textbox>
                                        </v:roundrect>
                                        <![endif]--></a>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-3" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div style="color:#120c80;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                        <p style="margin: 0; margin-bottom: 5px;">Thanks,</p>
                                        <p style="margin: 0;"><strong>one</strong>world alliance</p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-5" style="height:24px;line-height:24px;font-size:1px;"> </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 40px; padding-right: 40px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <div class="spacer_block block-1" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div align="center" class="alignment">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                        <tr>
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #E7F6FD;"><span> </span></td>
                                        </tr>
                                        </table>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-3" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad" style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 14px; font-weight: 400; text-align: center;">
                                    <table align="center" cellpadding="0" cellspacing="0" class="alignment" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                        <td style="vertical-align: middle; text-align: center; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 20px;"><a href="https://www.facebook.com/oneworldalliance"><img align="center" class="icon" height="32" src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65130810429a9b4ec65f82a7_facebook.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="32"/></a></td>
                                        <td style="vertical-align: middle; text-align: center; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 20px;"><a href="https://www.instagram.com/oneworld"><img align="center" class="icon" height="32" src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/6513081070bd2d2f9070e90a_instagram.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="32"/></a></td>
                                        <td style="vertical-align: middle; text-align: center; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 20px;"><a href="https://twitter.com/traveloneworld"><img align="center" class="icon" height="32" src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65130810550a6d90c53ac696_twitter.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="32"/></a></td>
                                        <td style="vertical-align: middle; text-align: center; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 20px;"><a href="https://www.youtube.com/channel/UCeafKxBlURQa_8t5btpGN5w"><img align="center" class="icon" height="32" src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/6513081054d0600ce40e52d4_youtube.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="32"/></a></td>
                                        <td style="vertical-align: middle; text-align: center; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 20px;"><a href="#"><img align="center" class="icon" height="32" src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/651308100b6f84f4e71d6cbc_linkedIn.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="32"/></a></td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-5" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div style="color:#82818d;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                                        <p style="margin: 0;">This email was sent to ${data.email}. If you'd rather not receive this kind of email, you can unsubscribe or manage your email preferences.</p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-7" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div style="color:#101112;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:16.8px;">
                                        <p style="margin: 0;"><a href="https://www.oneworld.com/privacy-policy" rel="noopener" style="text-decoration: none; color: #0071bc;" target="_blank">Privacy</a>  <a href="${CLIENT_URL}" rel="noopener" style="text-decoration: none; color: #0071bc;" target="_blank">Account</a>  <a href="${CLIENT_URL}/unsubscribe?e=${Buffer.from(data.email).toString("base64")}" rel="noopener" style="text-decoration: none; color: #0071bc;" target="_blank">Unsubscribe</a></p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-9" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                    <td class="pad">
                                    <div style="color:#82818d;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                                        <p style="margin: 0;">© 2023 <strong>one</strong>world Management Company. All Rights Reserved</p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <div class="spacer_block block-11" style="height:40px;line-height:40px;font-size:1px;"> </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                    <td class="pad" style="width:100%;">
                                    <div align="center" class="alignment" style="line-height:10px"><img src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/6512e94759925c12b8d5afac_Border_Bottom.png" style="display: block; height: auto; border: 0; max-width: 600px; width: 100%;" width="600"/></div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-15 mobile_hide" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                <tbody>
                    <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                        <tbody>
                            <tr>
                            <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <div class="spacer_block block-1" style="height:79px;line-height:79px;font-size:1px;"> </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>
        <!-- End -->
    </body>
    </html>
    `;

    return {
        Subject,
        TextBody,
        HtmlBody,
    };
};

export default WelcomeEmail2;
