import { mailtrapClient, sender } from "../lib/mailtrap";
import {
  createCommentNotificationEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailTemplates";

export const sendWelcomeEmail = async (
  email: string,
  name: string,
  profileUrl: string
) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: { email: sender.email || "default@example.com" },
      to: recipient,
      subject: "Welcome to linked-in",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "welcome",
    });

    console.log("Welcome Email sent successfully", response);
  } catch (error) {
    throw error;
  }
};

export const sendCommentNotificationEmail = async (
  recipientEmail: string,
  recipientName: string,
  commenterName: string,
  postUrl: string,
  commentContent: string
) => {
  const recipient = [{ email: recipientEmail }];

  try {
    const response = await mailtrapClient.send({
      from: { email: sender.email || "default@example.com" },
      to: recipient,
      subject: "New Comment on Your Post",
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ),
      category: "comment_notification",
    });
    console.log("Comment Notification Email sent successfully", response);
  } catch (error) {
    throw error;
  }
};
