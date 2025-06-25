import React from 'react'
import image from "../assets/TandC.png"

const TermsAndConditions = () => {
  return (


    <section className='pt-40 p-6 flex flex-col items-center max-w-5xl justify-center m-auto'>
      <div className=" text-center">
        <h1 className="text-4xl font-bold text-cyan-900 text-center ">Terms & Conditions</h1>
        <p className=" p-2 font-bold">By using PayWise, you agree to the following terms and conditions. Please read them carefully.</p>

        <div className='md:flex '>
          <p className="text-lg mb- px-4">
            <ol className='text-left space-y-2 list-decimal' >
              <li>Users must provide accurate and up-to-date information.</li>
              <li>PayWise reserves the right to suspend accounts involved in suspicious or fraudulent activities.</li>
              <li>Unauthorized transactions are strictly prohibited.</li>
              <li>Users are responsible for maintaining the confidentiality of their account credentials.</li>
              <li>All transactions are processed in USD, and exchange rates may apply for international transactions.</li>
              <li>PayWise is not liable for delays or failures in payment processing due to third-party services.</li>
              <li>Fees and charges associated with transactions are non-refundable.</li>
              <li>Users must comply with all applicable laws and regulations while using PayWise.</li>
              <li>PayWise reserves the right to update or modify these terms at any time without prior notice.</li>
              <li>Continued use of PayWise constitutes acceptance of the updated terms.</li>
            </ol>
          </p>


          <img src={image} alt="" />
        </div>
        
        <p className="text-lg mt-6 text-cyan-900 font-semibold">
          Join thousands of smart users who trust PayWise to simplify their financial transactions. Experience a
          smarter way to handle payments today!
        </p>
      </div>
    </section>












    // <section className='pt-40 p-6 flex flex-col items-center '>
    //   <h1 className="text-4xl font-bold text-cyan-900 text-center">Terms & Conditions</h1>
    //     <p className="mb-4">By using PayWise, you agree to the following terms and conditions. Please read them carefully.</p>
    //     <ul className="list-disc list-inside mb-6">
    //       <li>Users must provide accurate and updated information.</li>
    //       <li>Unauthorized transactions are prohibited.</li>
    //       <li>PayWise reserves the right to suspend accounts for violations.</li>
    //       <li>All transactions are in USD, and currency conversions are not supported.</li>
    //       <li>Users can earn reward tokens, but terms may change over time.</li>
    //       <li>Users can earn reward tokens, but terms may change over time.</li>
    //       <li>Users can earn reward tokens, but terms may change over time.</li>
    //       <li>Users can earn reward tokens, but terms may change over time.</li>
    //       <li>Users can earn reward tokens, but terms may change over time.</li>
    //       <li>Users can earn reward tokens, but terms may change over time.</li>
    //     </ul>
    // </section>
  )
}

export default TermsAndConditions
