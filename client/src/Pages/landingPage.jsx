import React from 'react'
import Header from '../components/Header'
import heropicture from "../assets/heropicture.png"
import heropicture2 from "../assets/Group-25.png"
import computer from "../assets/computer.png";
import files from "../assets/files.png";
import security from "../assets/security.png";
import tick from "../assets/tick.png";
import hero2 from "../assets/hero2.png";
import quote from "../assets/heroquote.png";


const LandingPage = () => {
    return (
        <>
            <div className='bg-zinc-100 border p-4'>
                <div className=''>
                    <Header />
                </div><br />
                <div className='p-6 md:px-6'>
                    <div>
                        <div className=''>
                            <img src={heropicture} className='h-full' />
                        </div>
                        <div>

                            <h1 className='font-medium text-5xl'>Pay Smarter, <span className='font-medium text-4xl'><br />live better</span></h1>
                            <p className='text-xl'>Goodbye to late fines and missed deadlines. PayWise allows you to automate regular payments, such as those for subscription services and utility bills. </p><br />
                            <button className='bg-blue-900 text-white p-4 rounded-3xl font-semibold hover:cursor-pointer'>Get Started Today!</button>
                        </div>
                    </div>

                    <div className='md:grid grid-cols-2'>
                        <div className='flex flex-col items-center'>
                            <img src={computer} alt="" className='w-fit' />

                            <h1 className='text-2xl font-bold'>Access and manage your bills from anywhere</h1>
                            <p>Keep your bills under control regardless of where you are. With PayWise, you can access, track, and pay your bills seamlessly through a single platform.</p>

                        </div>
                        <div className='flex flex-col items-center'>
                            <img src={security} alt="" className='w-fit' />

                            <h1 className='text-2xl font-bold'>Secure Transaction you can trust</h1>
                            <p>Experience peace of mind with every transaction. Our secure payment system ensures your financial data is protected with advanced encryption and fraud prevention measures. Trust us to keep your transactions safe and reliable, every step of the way.</p>

                        </div>
                        <div className='flex flex-col items-center'>
                            <img src={files} alt="" className='w-fit' />

                            <h1 className='text-2xl font-bold'>Simplify and organise your bills</h1>
                            <p>No more clutter or confusion! PayWise helps you centralize all your bills, making it easy to stay on top of your financial commitments.</p>

                        </div>
                        <div className='flex flex-col items-center'>
                            <img src={tick} alt="" className='w-fit' />

                            <h1 className='text-2xl font-bold'>Vendor Management and Payment made Easy</h1>
                            <p>Manage your vendors with ease. PayWise simplifies vendor payments, keeping your transactions smooth, organized, and on time.</p>

                        </div>
                    </div>

                    <div className='md:flex gap-4 items-center'>
                        <div className='flex-1'>
                            <img src={hero2} alt="" />
                        </div>
                        <div className=' flex-1 p-4 lg:pb-12'>
                            <h1 className='text-3xl font-bold'>Earn rewards for every automated payment</h1>
                            <p>Every time you use our platform for automated payments, you’ll earn reward-based tokens.
                                These tokens can be redeemed for discounts and exclusive perks,  making financial discipline more rewarding than ever.</p>
                        </div>
                    </div>
                    <div>
                        <div>
                            <img src={quote} alt="" />
                        </div>
                        <div className='md:flex gap-4'>
                            <div className='bg-neutral-300 p-14 rounded-4xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque dicta blanditiis, rerum iure officia illo, ipsa nemo hic corporis facilis unde quo saepe consequatur porro?</div><br />
                            <div className='bg-neutral-300 p-14 rounded-4xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque dicta blanditiis, rerum iure officia illo, ipsa nemo hic corporis facilis unde quo saepe consequatur porro?</div><br />
                            <div className='bg-neutral-300 p-14 rounded-4xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque dicta blanditiis, rerum iure officia illo, ipsa nemo hic corporis facilis unde quo saepe consequatur porro?</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingPage
