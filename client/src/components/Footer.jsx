import React from 'react'
import footerlogo from "../assets/footerlogo.png"
import logo from "../assets/paywise-logo.png"
import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Github } from 'lucide-react';
import { Linkedin } from 'lucide-react';



const Footer = () => {
    return (
        <>
            <footer className='flex items-center w-screenjustify-around  bg-neutral-900 text-white h-50' >
                <div className='flex flex-col '>
                    <img src={footerlogo} alt="" className='w-18' />
                    <p className='text-sm'>110234, Lagos, Nigeria.</p>
                </div>
                <div className=''>
                    <ul className='hover:cursor-pointer md:flex gap-8 text-sm'>
                        <a href="/about"><li>About</li></a>
                        <a href="/terms-and-conditions"><li>Terms</li></a>
                        <a href="/privacy-policy"><li>Privacy</li></a>
                    </ul>
                </div>
                <div className=''>
                    <ul className=' hover:cursor-pointer md:flex gap-4 items-center'>
                        <li><Phone/></li>
                        <li><Mail/></li>
                        <li><Github/></li>
                        <li><Linkedin/></li>
                    </ul>
                </div>
            </footer>
        </>
    )
}

export default Footer

