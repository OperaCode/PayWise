import React, { Children } from 'react'

import Header from '../components/Header'
import Footer from '../components/Footer'

// This layout should wrap the entire landing page, it includes header, main content, and footer.
const LandingLayout = ({children}) => {
    return (
        < >
           <div className=''>
             <Header />
           </div>
             
        </>
    )
}

export default LandingLayout
