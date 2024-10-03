import { mailtrapClient, sender } from "../lib/mailtrap";
import { createWelcomeEmailTemplate } from "./emailTemplates";

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
