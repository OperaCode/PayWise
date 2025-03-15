
import nodemailer from "nodemailer";




const sendVerificationEmail = async (email, firstName) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to PayWise - Activate Your Account",
        html: `
          <h2>Hello ${firstName},</h2>
          <p>Welcome to PayWise! Please verify your account by clicking the button below:</p>
          <a href="http://localhost:5173/dashboard" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block;">
            Go to Dashboard
          </a>
          <p>If you did not create this account, please ignore this email.</p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent to:", email);
    } catch (error) {
      console.error("Email sending error:", error);
    }
  };


  export { sendVerificationEmail };