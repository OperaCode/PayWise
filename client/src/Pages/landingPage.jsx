import React from 'react';
import Header from '../components/Header';
import heropicture from "../assets/hero1.png";
import computer from "../assets/computer.png";
import files from "../assets/files.png";
import security from "../assets/security.png";
import tick from "../assets/tick.png";
import hero2 from "../assets/hero2.png";
import quote from "../assets/heroquote.png";
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <>
            <div className='bg-zinc-100 w-full' >

                {/* Header  */}
                <div className=''>
                    <Header />
                </div>

                {/* Main Content */}
                <div className='container mx-auto  px-4  pt-30 '>

                    {/* Hero Section */}
                    <div className=' text-center'>
                        <img src={heropicture} className='w-full lg:w-svh m-auto' alt="Hero" />
                        {/* <h1 className='font-medium text-5xl md:text-7xl w-full'>Pay Smarter, <span className='text-4xl md:text-5xl'>Live Better</span></h1> */}
                        <h1 className='font-medium text-5xl md:text-7xl w-full'>Pay Smarter,</h1>
                        <p className='text-4xl md:text-5xl'>live better</p><br />

                        <p className='text-xl  w-xl m-auto'>Goodbye to late fines and missed deadlines. PayWise allows you to automate regular payments, such as those for subscription services and utility bills.</p>
                       <Link to="/register">
                       <button className='bg-cyan-700 text-white px-6 hover:cursor-pointer py-3 rounded-3xl font-semibold mt-4 hover:bg-blue-900'>Get Started Today!</button>
                       </Link>
                    </div>

                    {/* Features Section */}
                    <div className='grid md:grid-cols-2 gap-8 mt-12'>

                        {/* Feature 1 */}
                        <div className='flex flex-col items-center text-center w-sm m-auto'>
                            <img src={computer} alt="Manage Bills" className='w-fit' />
                            <h1 className='text-2xl font-bold mt-4'>Access and manage your bills from anywhere</h1>
                            <p className='mt-2'>Keep your bills under control regardless of where you are. With PayWise, you can access, track, and pay your bills seamlessly through a single platform.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className='flex flex-col items-center text-center w-sm m-auto'>
                            <img src={security} alt="Secure Transactions" className='w-fit' />
                            <h1 className='text-2xl font-bold mt-4'>Secure Transactions You Can Trust</h1>
                            <p className='mt-2'>Experience peace of mind with every transaction. Our secure payment system ensures your financial data is protected with advanced encryption and fraud prevention measures.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className='flex flex-col items-center text-center w-sm m-auto'>
                            <img src={files} alt="Organize Bills" className='w-fit' />
                            <h1 className='text-2xl font-bold mt-4'>Simplify and Organize Your Bills</h1>
                            <p className='mt-2'>No more clutter or confusion! PayWise helps you centralize all your bills, making it easy to stay on top of your financial commitments.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className='flex flex-col items-center text-center w-sm m-auto'>
                            <img src={tick} alt="Vendor Management" className='w-fit' />
                            <h1 className='text-2xl font-bold mt-4'>Vendor Management and Payments Made Easy</h1>
                            <p className='mt-2'>Manage your vendors with ease. PayWise simplifies vendor payments, keeping your transactions smooth, organized, and on time.</p>
                        </div>
                    </div>

                    {/* Rewards Section */}
                    <div className='md:flex gap-8 items-center mt-16 '>
                        <div className='flex-1'>
                            <img src={hero2} alt="Earn Rewards" className='' />
                        </div>
                        <div className='flex-1 p-4 md:w- m-auto text-center'>
                            <h1 className='text-3xl font-bold md:text-5xl '>Earn rewards for every automated payment</h1>
                            <p className='mt-2'>Every time you use our platform for automated payments, you’ll earn reward-based tokens. These tokens can be redeemed for discounts and exclusive perks, making financial discipline more rewarding than ever.</p>
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div className=''>
                        <div className=''>
                            <img src={quote} alt="Testimonials" className=' w-16' />
                        </div>
                        <div className='grid md:grid-cols-3 gap-8 mb-8 px-6'>
                            <div className='bg-neutral-300 p-8 rounded-xl'>The automated bill payment feature ensures that my utility bills, internet, and subscriptions are paid on time. PayWise is a game changer for anyone looking for seamless bill management!
                            <br /><span> — David A., Digital Marketer</span></div>
                            <div className='bg-neutral-300 p-8 rounded-xl'>PayWise solved bill payment frustrations with instant transfers—no more waiting hours or even days for money to reflect!
                            <br /><span> — Jessica T., Small Business Owner</span>
                            </div>
                            <div className='bg-neutral-300 p-8 rounded-xl'>I was skeptical at first, but PayWise exceeded my expectations. Setting up my wallet was instant, and I love that I can fund it directly from my bank or card.
                            <br /><span>— Michael R., Software Engineer</span></div>
                            </div>
                        </div>
                    
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}

export default LandingPage;
