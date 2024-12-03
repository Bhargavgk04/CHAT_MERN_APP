import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { authUser } = useSelector(store => store.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, []);
  return (
    // bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 h-64 w-full
    <div className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-white'>
      <Sidebar />
      <MessageContainer />
    </div>
  )
}

export default HomePage