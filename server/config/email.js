const axios = require("axios");

const sendEmailJS = async ({ to_name, to_email, template_id, extras = {} }) => {
  try {
    if (!to_name || !to_email || !template_id) {
      throw new Error("Missing required email parameters.");
    }

    const payload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id,
      private_key: process.env.EMAILJS_API_KEY,
      template_params: {
        to_name,
        to_email,
        ...extras,
      },
    };

    await axios.post("https://api.emailjs.com/api/v1.0/email/send", payload);
    console.log(`✅ Email sent to: ${to_email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.response?.data || error.message || error);
  }
};

// Send welcome email on registration
const sendWelcomeEmail = (name, email) => {
  return sendEmailJS({
    to_name: name,
    to_email: email,
    template_id: process.env.EMAILJS_TEMPLATE_WELCOME,
  });
};

// Send sign-in alert email on login
const sendSignInEmail = (name, email) => {
  const now = new Date().toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return sendEmailJS({
    to_name: name,
    to_email: email,
    template_id: process.env.EMAILJS_TEMPLATE_SIGNIN,
    extras: { signin_time: now },
  });
};

module.exports = {
  sendWelcomeEmail,
  sendSignInEmail,
};
