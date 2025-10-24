import { CLIENT_URL } from "@config/global";

export type CourseCompletionEmailParams = {
  name: string,
  courseName: string,
  completionDate: string,
  certificateName: string,
  email: string
};

const CourseCompletionEmail = (
  data: CourseCompletionEmailParams,
) => {
  const TextBody = `Course completed successfully`;
  const Subject = `Course completed successfully`;

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
            sup,
            sub {
            line-height: 0;
            font-size: 75%;
            }
            #converted-body .list_block ul,
            #converted-body .list_block ol,
            .body [class~="x_list_block"] ul,
            .body [class~="x_list_block"] ol,
            u+.body .list_block ul,
            u+.body .list_block ol {
            padding-left: 20px;
            }
            @media (max-width:620px) {
            .desktop_hide table.icons-outer {
            display: inline-table !important;
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
            .row-8 .column-1 .block-1.spacer_block {
            height: 38px !important;
            }
            .row-3 .column-1,
            .row-5 .column-1,
            .row-6 .column-1 {
            padding: 0 24px !important;
            }
            .row-4 .column-1 {
            padding: 24px !important;
            }
            }
          </style>
          <!--[if mso ]>
          <style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style>
          <![endif]-->
      </head>
      <body class="body" style="margin: 0; background-color: #f8f8f8; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
          <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;" width="100%">
            <tbody>
                <tr>
                  <td>
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                        <tbody>
                            <tr>
                              <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px; margin: 0 auto;" width="600">
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
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px; margin: 0 auto;" width="600">
                                    <tbody>
                                        <tr>
                                          <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                              <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                <tr>
                                                    <td class="pad" style="width:100%;">
                                                      <div align="center" class="alignment" style="line-height:10px">
                                                          <div style="max-width: 600px;"><img height="auto" src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/6512e94777b4a6f925caeeb1_Email_Header.png" style="display: block; height: auto; border: 0; width: 100%;" width="600"/></div>
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
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                        <tbody>
                            <tr>
                              <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 600px; margin: 0 auto;" width="600">
                                    <tbody>
                                        <tr>
                                          <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 50px; padding-right: 50px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                              <div class="spacer_block block-1" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                              <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                                <tr>
                                                    <td class="pad">
                                                      <div style="color:#120c80;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                          <p style="margin: 0;">Dear ${data.name},<br/><br/>Bravo! 🌟 You've successfully completed your <strong>one</strong>world training course, marking a significant milestone in your journey of learning and professional growth. This achievement reflects your dedication, hard work, and commitment to creating the world's most seamless and rewarding traveller experience for our customers.</p>
                                                      </div>
                                                    </td>
                                                </tr>
                                              </table>
                                              <div class="spacer_block block-3" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                          </td>
                                        </tr>
                                    </tbody>
                                  </table>
                              </td>
                            </tr>
                        </tbody>
                      </table>
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                        <tbody>
                            <tr>
                              <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; color: #000000; width: 600px; margin: 0 auto;" width="600">
                                    <tbody>
                                        <tr>
                                          <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 24px; padding-left: 50px; padding-right: 50px; padding-top: 24px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                              <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                                <tr>
                                                    <td class="pad">
                                                      <div style="color:#120c80;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                          <p style="margin: 0; margin-bottom: 18px;"><strong>Your Course Completion Details:</strong><br/><br/><strong>Courses Title:</strong> ${data.courseName}</p>
                                                          <p style="margin: 0; margin-bottom: 18px;"><strong>Completion Date:</strong> ${data.completionDate}</p>
                                                          <p style="margin: 0;"><strong>Certification:</strong> ${data.certificateName}</p>
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
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                        <tbody>
                            <tr>
                              <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px; margin: 0 auto;" width="600">
                                    <tbody>
                                        <tr>
                                          <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 50px; padding-right: 50px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                              <div class="spacer_block block-1" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                              <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                                <tr>
                                                    <td class="pad">
                                                      <div style="color:#120c80;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                          <p style="margin: 0; margin-bottom: 5px;">We are thrilled to award you this certification, recognizing your expertise and the skills you've gained. Your accomplishment not only enhances your professional profile but also contributes to elevating the </strong>one</strong>world experience.</p>
                                                          <p style="margin: 0; margin-bottom: 5px;"> </p>
                                                          <p style="margin: 0;"><strong>What’s Next?</strong></p>
                                                      </div>
                                                    </td>
                                                </tr>
                                              </table>
                                              <div class="spacer_block block-3" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                              <table border="0" cellpadding="0" cellspacing="0" class="list_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; color: #120c80; direction: ltr; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; letter-spacing: 0px; line-height: 120%; text-align: left; mso-line-height-alt: 19.2px;" width="100%">
                                                <tr>
                                                    <td class="pad">
                                                      <div style="margin-left:-20px">
                                                          <ul start="1" style="margin-top: 0; margin-bottom: 0; list-style-type: revert;">
                                                            <li style="Margin: 0 0 24px 0;"><strong>Share Your Achievement:</strong> Celebrate your success by sharing your certification with peers, mentors, and on professional networks. It's a testament to your commitment to continuous improvement.</li>
                                                            <li style="Margin: 0 0 24px 0;"><strong>Apply What You've Learned:</strong> Implement the knowledge and skills acquired in your day-to-day responsibilities, making a tangible impact on your work.</li>
                                                            <li style="Margin: 0 0 24px 0;"><strong>Continue Learning:</strong> The journey doesn't stop here! Explore other courses to further your expertise. Continuous learning is key to staying ahead in the fast-paced world of aviation.</li>
                                                          </ul>
                                                      </div>
                                                    </td>
                                                </tr>
                                              </table>
                                              <div class="spacer_block block-5" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                              <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                                <tr>
                                                    <td class="pad">
                                                      <div style="color:#120c80;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                          <p style="margin: 0; margin-bottom: 5px;"><strong>Feedback and Support:</strong></p>
                                                          <p style="margin: 0; margin-bottom: 5px;"> </p>
                                                          <p style="margin: 0; margin-bottom: 5px;">We'd love to hear about your experience! Your feedback is invaluable in helping us improve our courses and the learning platform. Please feel free to share your thoughts or suggestions at <a href="mailto:training@oneworld.com">training@oneworld.com</a>.</p>
                                                          <p style="margin: 0; margin-bottom: 5px;"><br/>If you have any questions about your certification or need further assistance, our support team is here to help. Contact us at <a href="mailto:training@oneworld.com">training@oneworld.com</a> for any inquiries.</p>
                                                          <p style="margin: 0; margin-bottom: 5px;"><br/>Congratulations once again on this wonderful achievement. We look forward to supporting you in your continued journey of learning and excellence.</p>
                                                          <p style="margin: 0; margin-bottom: 5px;"> </p>
                                                          <p style="margin: 0; margin-bottom: 5px;">Regards,</p>
                                                          <p style="margin: 0;"><strong>one</strong>world Management Company</p>
                                                      </div>
                                                    </td>
                                                </tr>
                                              </table>
                                              <div class="spacer_block block-7" style="height:24px;line-height:24px;font-size:1px;"> </div>
                                          </td>
                                        </tr>
                                    </tbody>
                                  </table>
                              </td>
                            </tr>
                        </tbody>
                      </table>
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
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
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                        <tbody>
                            <tr>
                              <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px; margin: 0 auto;" width="600">
                                    <tbody>
                                        <tr>
                                          <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                              <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                <tr>
                                                    <td class="pad" style="width:100%;">
                                                      <div align="center" class="alignment" style="line-height:10px">
                                                          <div style="max-width: 600px;"><img height="auto" src="https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/6512e94759925c12b8d5afac_Border_Bottom.png" style="display: block; height: auto; border: 0; width: 100%;" width="600"/></div>
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
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8 mobile_hide" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f8;" width="100%">
                        <tbody>
                            <tr>
                              <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px; margin: 0 auto;" width="600">
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
  `
  return {
      Subject,
      TextBody,
      HtmlBody,
  };
};

export default CourseCompletionEmail;