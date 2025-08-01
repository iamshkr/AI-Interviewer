"use client"
import React,{useEffect} from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'

function Header() {
   
     const path=usePathname();
     const router=useRouter();

     useEffect(()=>{
     console.log(path)
     },[])

  return (
    <div className='flex p-4 items-center justify-between bg secondary shadow-md'>
 <Image src={'/mylogo4.jpg'} width={160} height={100} alt='logo'/>
    <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer    
             ${path=='/dashboard'&&'text-primary font-bold'}
            
            `}
            onClick={()=>router.push('/dashboard')}
            >Dashboard</li>
        <li  className={`hover:text-primary hover:font-bold transition-all cursor-pointer    
             ${path=='/dashboard/Questions'&&'text-primary font-bold'}
            
            `}
            onClick={()=>router.push('/dashboard/questions')}>Questions</li>
        <li  className={`hover:text-primary hover:font-bold transition-all cursor-pointer    
             ${path=='/dashboard/Upgrade'&&'text-primary font-bold'}
            
            `}
            onClick={()=>router.push('/dashboard/upgrade')}>Upgrade</li>
        <li  className={`hover:text-primary hover:font-bold transition-all cursor-pointer    
             ${path=='/dashboard/How it works'&&'text-primary font-bold'}
            
            `}>How it works</li>
    </ul>
    <UserButton/>
    </div>
  )
}

export default Header