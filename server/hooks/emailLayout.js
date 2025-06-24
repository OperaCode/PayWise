export const emailLayout = (title, content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    
    <!-- Header with Logo -->
    <div style="background: #16a34a; padding: 20px; text-align: center;">
      <img 
        src="https://res.cloudinary.com/dmlhebmi8/image/upload/v1742915517/WhatsApp_Image_2025-03-25_at_16.11.12_izlbju.jpg" 
        alt="PayWise Logo" 
        style="height: 40px; margin-bottom: 4px;" />
      <h1 style="color: white; font-size: 20px; margin-top: 8px;">PayWise</h1>
    </div>

    <!-- Email Body -->
    <div style="padding: 24px;">
      <h2 style="color: #1a1a1a;">${title}</h2>
      <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
      ${content}
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #888;">
        Need help? Contact us at 
        <a href="mailto:support@paywise.com">support@paywise.com</a><br/>
        &copy; ${new Date().getFullYear()} PayWise Inc.
      </p>
    </div>
  </div>
`;
