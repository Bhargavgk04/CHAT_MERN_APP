import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { authUser, selectedUser } = useSelector(store => store.user);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    // On mobile: show Sidebar if no user selected, else show MessageContainer
    return (
      <div className='flex h-screen w-full min-h-screen bg-white'>
        {selectedUser ? <MessageContainer /> : <Sidebar />}
      </div>
    );
  }

  // On desktop: show both in a beautiful centered card
  return (
    <div className='flex items-center justify-center min-h-screen w-full bg-transparent'>
      <div className='flex h-[80vh] w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-200'>
        <div className='flex h-full'><Sidebar /></div>
        <div className='flex flex-1 h-full'><MessageContainer /></div>
      </div>
    </div>
  )
}

export default HomePage