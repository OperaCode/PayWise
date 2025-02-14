import React from 'react'

const AboutUs = () => {
  return (
    <section className='mt-50'>
      <h1 className='text-5xl text-center'>About Us</h1>
      <p className='text-lg text-center'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel massa id urna ullamcorper vulputate. Nullam euismod, velit vel fringilla fermentum, ligula justo laoreet velit, at finibus massa mi vel lectus.
      </p>
      <Link to='/' className='bg-green-400 text-white py-3 px-5 rounded-md hover:bg-green-500 transition duration-300'>
        Back to Home
      </Link>
    </section>
  )
}

export default AboutUs
