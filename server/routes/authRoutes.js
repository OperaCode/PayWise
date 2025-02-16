const express = require("express");
const passport = require("passport");

const router = express.Router();

// Route to start Google login process
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // Redirect if login fails
    session: false, // We use JWT instead of session cookies
  }),
  (req, res) => {
    // Generate JWT token for the user
    const token = generateToken(req.user._id); // Implement this function

    // Send token in response or redirect
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 86400000),
      sameSite: "none",
      secure: true,
    });

    res.redirect("/dashboard"); // Redirect to frontend
  }
);

module.exports = router;
