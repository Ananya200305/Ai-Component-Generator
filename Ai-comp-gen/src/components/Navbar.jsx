import React from 'react'
import { MdOutlineWbSunny } from "react-icons/md";
import { FaUser } from "react-icons/fa";


function Navbar() {
  return (
    <>
      <div className="nav flex items-center justify-between px-[100px] h-[90px] border-b-[1px] border-b-rounded shadow-xl border-gray-800">
        <div className="logo">
            <div className='text-[25px] font-[700] sp-text'>GenUI</div>
        </div>
        <div className='icon flex items-center gap-[60px]'>
            <button className='icons'><MdOutlineWbSunny /></button>
            <button className='icons'><FaUser /></button>
        </div>
      </div>
    </>
  )
}

export default Navbar
