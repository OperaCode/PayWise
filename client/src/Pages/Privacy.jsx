import React from 'react'
import image from "../assets/privacy.png"

const Privacy = () => {
  return (

<section className='pt-40 p-6 flex flex-col items-center'> 
      <div className="max-w-6xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-cyan-900">Privacy Policy</h1>
        <p className="text-lg mb-6 font-bold">
        Your privacy is important to us. This policy outlines how we collect, use, and protect your data.
        </p>
        <div className='flex '>
        <ul className="list-decimal text-left space-y-4 font-bold">
         <li>We collect only necessary data for transactions and security.</li>
           <li>Your personal information is never shared without consent.</li>
          <li>Users can request data deletion at any time.</li>
          <li>All data is encrypted and securely stored.</li>
          <li>Cookies may be used for a better user experience.</li>
        </ul>
        <img src={image} alt="" />
        </div>
        
      </div>     
    </section>


  )
}

export default Privacy
