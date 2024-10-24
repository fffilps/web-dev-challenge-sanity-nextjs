import React from 'react'
import Link from 'next/link'
import { Gift } from 'lucide-react'



const NavBar = () => {
  return (
    <div>
        <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Gift className="h-6 w-6 text-red-600" />
          <span className="ml-2 text-2xl font-bold text-red-600">Santa&apos;s CMS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
    </div>
  )
}

export default NavBar