const admin = require("firebase-admin");
const serviceAccount = require("../utils/firebaseAdmin.json"); // Replace with your actual file path

// if (!admin.apps.length) {
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     });
//   }


// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};


module.exports = {verifyUser};