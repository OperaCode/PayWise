import React from 'react'

const TermsAndConditions = () => {
  return (
    <div className='mt-40 h-90'>
      <h1 className="text-4xl font-bold text-cyan-900 text-center">Terms & Conditions</h1>
        <p className="mb-4">By using PayWise, you agree to the following terms and conditions. Please read them carefully.</p>
        <ul className="list-disc list-inside mb-6">
          <li>Users must provide accurate and updated information.</li>
          <li>Unauthorized transactions are prohibited.</li>
          <li>PayWise reserves the right to suspend accounts for violations.</li>
          <li>All transactions are in USD, and currency conversions are not supported.</li>
          <li>Users can earn reward tokens, but terms may change over time.</li>
        </ul>
    </div>
  )
}

export default TermsAndConditions
