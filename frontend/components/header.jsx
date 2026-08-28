import Image from 'next/image'
import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='py-5 px-5 md:px-12 lg:px-28'>
        <div className='flex items-center justify-between'>
            <Image src={assets.logo} alt="logo" width={60} className='w-[30px] sm:w-[auto]' />
            <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-gray-400 rounded-full shadow-[-3px_3px_0px_#616161]'>Get Started <Image src={assets.arrow}  /></button>
        </div>
        <div className='text-center my-8'>
            <h1 className='text-1xl sm:text-3xl md:text-4xl font-medium'>Latest Blogs</h1>
            <p className='mt-3 max-w-[600px] m-auto text-sm sm:text-base'>Discover the latest blogs and articles on various topics</p>
            <form className='flex justify-between m-auto gap-2 mt-10 scale-75 sm:scale-100 mx-auto max-w-[500px] bg-gray border border-gray-300 rounded-full shadow-md'>
                <input type="email" placeholder='Enter your email...' className='flex-1 px-4 py-2 focus:outline-none' />
                <button className='bg-black text-white px-4 py-2 rounded-full'>Subscribe</button>
            </form>
        </div>
    </div>
  )
}

export default Header