const admin = require("firebase-admin");
const serviceAccount = require("../utils/firebaseAdmin.json"); // Replace with your actual file path

// if (!admin.apps.length) {
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     });
//   }


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



module.exports = admin;