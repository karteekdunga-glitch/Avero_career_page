import { getTransporter } from '../config/mailer.js';

export async function sendHiredEmail({ name, email, jobTitle }) {
  const transporter = getTransporter();
  if (!transporter) return false;
  await transporter.sendMail({
    from: 'Avero Advisors <info@averoadvisors.com>',
    to: email,
    subject: 'Congratulations! You Have Been Hired',
    text: `Dear ${name},\n\nCongratulations! You have been hired for the ${jobTitle} position at Avero Advisors.\nFor further details, please wait for our HR team to contact you or call [Contact Number].\n\nBest regards,\nAvero Advisors Team`,
  });
  return true;
}
