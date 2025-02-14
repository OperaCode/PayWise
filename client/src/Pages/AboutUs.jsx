import React from 'react'

const AboutUs = () => {
  return (
    <>
    <section className='mt-40 p-6 flex flex-col items-center'> 
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-cyan-900">About PayWise</h1>
        <p className="text-lg mb-6 ">
          PayWise is your trusted partner in seamless, automated bill payments and financial transactions.
          Our platform is designed to give you full control over your payments, ensuring convenience, security,
          and efficiency.
        </p>
        <h2 className="text-2xl font-semibold mb-3 text-cyan-900">Why Choose PayWise?</h2>
        <ul className="list-disc list-inside text-left mx-auto max-w-xl">
          <li className="mb-2">Instant wallet creation upon registration.</li>
          <li className="mb-2">Automate your bill payments with ease.</li>
          <li className="mb-2">Secure and seamless peer-to-peer transactions.</li>
          <li className="mb-2">Integration with banks and payment gateways.</li>
          <li className="mb-2">Earn reward tokens for every successful transaction.</li>
          <li className="mb-2">24/7 support to ensure smooth transactions.</li>
        </ul>
        <p className="text-lg mt-6 text-cyan-900 font-semibold">
          Join thousands of /smart users who trust PayWise to simplify their financial transactions. Experience a
          smarter way to handle payments today!
        </p>
      </div>     
    </section>
    </>
  )
}

export default AboutUs
