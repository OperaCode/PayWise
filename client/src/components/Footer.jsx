import React from 'react'
import footerlogo from "../assets/footerlogo.png"
import logo from "../assets/paywise-logo.png"
import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Github } from 'lucide-react';


const Footer = () => {
    return (
        <>
            <footer className='flex items-center w-full justify-around p-4 bg-neutral-900 text-white' >
                <div className='flex flex-col '>
                    <img src={footerlogo} alt="" className='w-24' />
                    <p>110234, Lagos, Nigeria.</p>
                </div>
                <div className=''>
                    <ul className='hover:cursor-pointer md:flex gap-4'>
                        <li>About</li>
                        <li>Terms and Condition</li>
                        <li>Privacy</li>
                    </ul>
                </div>
                <div className='items-center'>
                    <ul className='space-y-6 hover:cursor-pointer md:flex gap-4 items-center'>
                        <l><Phone/></l>
                        <l><Mail/></l>
                        <l><Github/></l>
                    </ul>
                </div>
            </footer>
        </>
    )
}

export default Footer

