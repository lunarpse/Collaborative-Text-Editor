import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = ({children,className}:{children:React.ReactNode,className?:string}) => {
  return (
    <div className={cn('header',className)}>
        <Link href="/" className='md:flex-1'>
        <Image src="/assets/icons/logo.svg" alt='Logo with name'
        height={32}
        width={120}
        className='hidden md:block'
        />
        <Image src='/assets/logo-icon.svg' alt='Logo' height={32} width={32} className='mr-2 md:hidden' />
         </Link>
         {children}
       
    </div>
  )
}

export default Header