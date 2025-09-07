import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Force emails to go to your test email in development
    const recipient =
      process.env.NODE_ENV === 'development'
        ? process.env.DEV_EMAIL
        : to;

    const { data, error } = await resend.emails.send({
      from: 'PayWise Support <onboarding@resend.dev>',
      to: recipient,
      subject,
      html,
    });

    if (error) {
      console.error("Email error:", error);
      return { success: false, error };
    }

     ("Email sent:", data.id);
    return { success: true, id: data.id };
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return { success: false, error: err.message };
  }
};

export { sendEmail };
