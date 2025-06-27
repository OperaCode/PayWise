
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_bou195l";
const WELCOME_TEMPLATE = "template_lkfgd5r";
const SIGNIN_TEMPLATE = "template_bzwwk6p";
const PUBLIC_KEY = "xfeUAfRmXM3rEb-Hp"; 

export const sendWelcomeEmail = (name, email) => {
  return emailjs.send(
    SERVICE_ID,
    WELCOME_TEMPLATE,
    { to_name: name, to_email: email },
    PUBLIC_KEY
  );
};

export const sendSignInEmail = (name, email) => {
  const signin_time = new Date().toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  console.log("📨 Preparing to send sign-in email to:", name, email);
  return emailjs.send(
    SERVICE_ID,
    SIGNIN_TEMPLATE,
    { to_name: name, to_email: email, signin_time },
    PUBLIC_KEY
  );
};
