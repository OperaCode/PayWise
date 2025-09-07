import React from "react";
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
//import axios from "axios";

// export default function App() {
//   const config = {
//     public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
//     tx_ref: Date.now(),
//     amount: 100,
//     currency: "USD",
//     payment_options: "card,mobilemoney,ussd",
//     customer: {
//       email: "user@gmail.com",
//       phone_number: "070********",
//       name: "john doe",
//     },
//     customizations: {
//       title: "Paywise Payment Checkout",
//       description: "Payment for items in cart",
//       logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRncNec98vHWGQ-3pODjzdPBD5HI3xw2tprK2IUI0Ufmkh7hfRm",
//     },
//   };



// const FundWallet = ({ user }) => {
//   const [amount, setAmount] = useState("");
//   const [email, setEmail] = useState("raphaelfaboyinde27@gmail.com");

//   const handleFlutterwave = useFlutterwave({
//     public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
//     tx_ref: `paywise-${Date.now()}`,
//     amount: amount,
//     currency: "USD",
//     payment_options: "card, banktransfer",
//     customer: { email},
//     customizations: {
//       title: "Fund Wallet",
//       description: "Add money to PayWise wallet",
//       logo: "https://your-logo-url.com/logo.png",
//     },
//     callback: async (response) => {
//       if (response.status === "successful") {
//         await axios.get(`/api/payments/verify-payment/${response.tx_ref}`);
//         alert("Wallet funded successfully!");
//       }
//       closePaymentModal();
//     },
//   });

//   return (
//     <div>
//       <input
//         type="number"
//         placeholder="Enter amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />
//       <button onClick={() => handleFlutterwave()}>Fund Wallet</button>
//     </div>
//   );
// };

const FlutterWavePayment = () => {
  const flutterwaveConfig = {
    public_key: import.meta.env.VITE_FLW_PUBLIC_KEY, 
    tx_ref: "tx_" + Date.now(),
    amount: 100, 
    currency: "USD",
    payment_options: "card, mobilemoney, ussd",
    customer: {
      email: "user@example.com",
      phone_number: "1234567890",
      name: "John Doe",
    },
    customizations: {
      title: "PayWise Wallet Funding",
      description: "Funding your PayWise Wallet",
      logo: "https://your-logo-url.com/logo.png",
    },
    callback: (response) => {
      //  ("Payment successful:", response);
      closePaymentModal(); 
    },
    onclose: () => {
      //  ("Payment modal closed");
    },
  };

  return (
    <FlutterWaveButton
      className=" text-white rounded p-2 bg-cyan-800 hover:cursor-pointer  hover:bg-cyan-500 transition"
      {...flutterwaveConfig}
    >Pay with Flutterwave</FlutterWaveButton>
  );
};

export default FlutterWavePayment;