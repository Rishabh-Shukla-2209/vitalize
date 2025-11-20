import Link from 'next/link'
import React from 'react'
import Logo from '../icons/Logo'
import Icons from '../icons/appIcons'

const Footer = () => {
  return (
    <div className='pb-10 md:pb-0'>
      <div className="h-0.5 bg-gray-300" />
      <div className="p-3.5 flex flex-wrap gap-2 items-center justify-around text-sm">
        <Link href={"/home"}>
          <div className="flex-center gap-1.5 cursor-pointer">
            <Logo />
            <p className="font-bold text-lg">VitalAIze</p>
          </div>
        </Link>
        <div className="flex items-center gap-7">
          <ul className="flex gap-7 font-light text-zinc-600">
            <li className="cursor-pointer hover:text-gray-900">About</li>
            <li className="cursor-pointer hover:text-gray-900">Privacy Policy</li>
            <li className="cursor-pointer hover:text-gray-900">Contact</li>
          </ul>
        </div>
        <div className='flex gap-1 text-zinc-600'>
          <Icons.copyright />
          <p>2025 Vitalize. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Footer