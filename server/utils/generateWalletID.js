import { v4 as uuidv4 } from "uuid";
import Wallet from "../models/Wallet.js"; // Ensure you have a Wallet model

const generateWalletID = async () => {
  let walletID;
  let isUnique = false;

  while (!isUnique) {
    walletID = `PW-${uuidv4().split("-")[0].toUpperCase()}`; // Example: PW-AB12CD34
    const existingWallet = await Wallet.findOne({ walletID });
    if (!existingWallet) {
      isUnique = true;
    }
  }

  return walletID;
};

export default generateWalletID;
