import { sendEmail } from "../utils/sendEmail.js";
import { emailLayout } from '../hooks/emailLayout.js';



// 1. Registration Email
export const sendRegistrationEmail = async (email, firstName) => {
//   const link = `${process.env.FRONTEND_URL}/dashboard`;
//   const html = `
//     <h2>🎉 Welcome to PayWise, ${firstName}!</h2>
//     <p>You're now part of the smartest way to manage bills. Click below to get started:</p>
//     <a href="${link}" style="padding:10px 20px; background:#16a34a; color:white; border-radius:5px; text-decoration:none;">Open Dashboard</a>
//   `;
//   return await sendEmail({ to: email, subject: "🎉 Welcome to PayWise", html });
const link = `${process.env.FRONTEND_URL}/dashboard`;

  const content = `
    <p>Hi ${firstName},</p>
    <p>You're now part of the smartest way to manage bills with <strong>PayWise</strong>.</p>
    <p>Click below to get started:</p>
    <a href="${link}" style="display:inline-block; margin-top:12px; padding:10px 20px; background:#16a34a; color:white; border-radius:6px; text-decoration:none;">Open Dashboard</a>
  `;

  const html = emailLayout(`🎉 Welcome to PayWise, ${firstName}!`, content);

  return await sendEmail({ to: email, subject: "🎉 Welcome to PayWise", html });
};

// 2. Sign-In Email
export const sendSignInEmail = async (email, firstName) => {
    const time = new Date().toLocaleString();

    const content = `
      <p>Hello ${firstName},</p>
      <p>We noticed a new sign-in to your PayWise account at <strong>${time}</strong>.</p>
      <p>If this wasn't you, please <a href="${process.env.FRONTEND_URL}/reset-password">reset your password</a> immediately.</p>
    `;
  
    const html = emailLayout("🔐 New Sign-In Detected", content);
  
    return await sendEmail({ to: email, subject: "🔐 New Sign-In Detected", html });
};

// 3. Biller Added Email
export const sendBillerAddedEmail = async (email, billerName) => {
  const html = `
    <h2>✅ Biller Added</h2>
    <p>You successfully added <strong>${billerName}</strong> to your PayWise account.</p>
    <p>You can now schedule or automate payments.</p>
  `;
  return await sendEmail({ to: email, subject: `✅ ${billerName} Added to PayWise`, html });
};
