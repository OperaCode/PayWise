import nodemailer from "nodemailer";



 // ✅ Secure email transport setup
 const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // TLS (recommended)
    secure: false, // Use `true` for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


const sendVerificationEmail = async (email, firstName) => {
  try {
   
    const activationLink = `http://localhost:5173/dashboard`;

    // ✅ Enhanced HTML email with TailwindCSS styling
    const mailOptions = {
      from: `"PayWise Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🚀 Welcome to PayWise ",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Verify Your PayWise Account</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100">
        <div class="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800">Welcome to <span class="text-green-600">PayWise</span>, ${firstName}! 🎉</h2>
          
          <p class="text-gray-700 mt-4">
            To start using PayWise, please verify your email by clicking the button below:
          </p>

          <div class="text-center mt-6">
            <a href="${activationLink}"
              class="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg text-lg shadow-md hover:bg-green-700 transition">
              Activate My Account
            </a>
          </div>

          <p class="text-gray-600 mt-4">
            If the button above doesn’t work, copy and paste this link into your browser:
          </p>

          <p class="text-blue-500 break-words mt-2">
            <a href="${activationLink}">${activationLink}</a>
          </p>

          <p class="text-gray-600 mt-4">
            If you did not create this account or initiate a sign in, please reach out to our support team.
          </p>

          <div class="border-t mt-6 pt-4 text-center">
            <p class="text-gray-500 text-sm">
              Need help? Contact our support team at 
              <a href="mailto:support@paywise.com" class="text-blue-600">support@paywise.com</a>
            </p>
            <p class="text-gray-400 text-xs mt-2">© 2025 PayWise Inc. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    // ✅ Send email and log success message
    const info = await transporter.sendMail(mailOptions);
    //console.log(`✅ Verification email sent to: ${email}, Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
  }
};

const sendWelcomeBackEmail = async (email, firstName) => {
  try {
   
    const activationLink = `http://localhost:5173/dashboard`;

    // ✅ Enhanced HTML email with TailwindCSS styling
    const mailOptions = {
      from: `"PayWise Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🚀 Welcome to PayWise - Activate Your Account",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Verify Your PayWise Account</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100">
        <div class="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800">Welcome back to <span class="text-green-600">PayWise</span>, ${firstName}! 🎉</h2>
          
          <p class="text-gray-700 mt-4">
            Its good to have you here!
          </p>


          <p class="text-gray-600 mt-4">
            To check your paywise activity, copy and paste this link into your browser:
          </p>

          <p class="text-blue-500 break-words mt-2">
            <a href="${activationLink}">${activationLink}</a>
          </p>

          <p class="text-gray-600 mt-4">
            If you did not initiate this sign in, please reach out to our support team to help us protect your account..
          </p>

          <div class="border-t mt-6 pt-4 text-center">
            <p class="text-gray-500 text-sm">
              Need help? Contact our support team at 
              <a href="mailto:support@paywise.com" class="text-blue-600">support@paywise.com</a>
            </p>
            <p class="text-gray-400 text-xs mt-2">© 2025 PayWise Inc. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    // ✅ Send email and log success message
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to: ${email}, Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
  }
};

const sendMetaMaskEmail = async (email, firstName) => {
  try {
   
    const activationLink = `http://localhost:5173/dashboard`;

    // ✅ Enhanced HTML email with TailwindCSS styling
    const mailOptions = {
      from: `"PayWise Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🚀 Welcome to PayWise - Activate Your Account",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Verify Your PayWise Account</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100">
  <div class="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800">
      Your <span class="text-green-600">MetaMask Wallet</span> is now linked! 🎉
    </h2>
    
    <p class="text-gray-700 mt-4">
      Hi ${firstName}, your MetaMask wallet has been successfully connected to PayWise.
    </p>

    <div class="bg-gray-200 p-4 rounded-lg mt-4">
      <p class="text-gray-800 font-semibold">Linked Wallet Address:</p>
      <p class="text-blue-500 break-words">${walletAddress}</p>
    </div>

    <p class="text-gray-600 mt-4">
      You can now manage your transactions and make payments directly from your MetaMask wallet.
    </p>

    <p class="text-gray-600 mt-4">
      Click the link below to view your account activity:
    </p>

    <p class="text-blue-500 break-words mt-2">
      <a href="${activationLink}">${activationLink}</a>
    </p>

    <p class="text-gray-600 mt-4">
      If you did not authorize this action, please contact our support team immediately.
    </p>

    <div class="border-t mt-6 pt-4 text-center">
      <p class="text-gray-500 text-sm">
        Need help? Contact our support team at 
        <a href="mailto:support@paywise.com" class="text-blue-600">support@paywise.com</a>
      </p>
      <p class="text-gray-400 text-xs mt-2">© 2025 PayWise Inc. All rights reserved.</p>
    </div>
  </div>
</body>
      </html>
      `,
    };

    // ✅ Send email and log success message
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to: ${email}, Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
  }
};

export { sendVerificationEmail, sendWelcomeBackEmail,sendMetaMaskEmail };
