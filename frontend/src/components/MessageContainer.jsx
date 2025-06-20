import React from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import { useSelector,useDispatch } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';
import { IoArrowBack } from 'react-icons/io5';

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const isOnline = onlineUsers?.includes(selectedUser?._id);
    const isMobile = window.innerWidth < 768;

    const handleBack = () => {
        dispatch(setSelectedUser(null));
    };

    return (
        <>
            {
                selectedUser !== null ? (
                    <div className='flex flex-col h-full w-full flex-1'>
                        {/* Sticky header for mobile */}
                        <div className={`flex gap-2 items-center bg-zinc-800 text-white px-4 py-2 mb-2 ${isMobile ? 'sticky top-0 z-10' : ''}`}>
                            {isMobile && (
                                <button onClick={handleBack} className="mr-2 text-2xl p-1 rounded-full hover:bg-zinc-700 focus:outline-none">
                                    <IoArrowBack />
                                </button>
                            )}
                            <div className={`avatar ${isOnline ? 'online' : ''}`}>
                                <div className='w-12 rounded-full'>
                                    <img src={selectedUser?.profilePhoto} alt="user-profile" />
                                </div>
                            </div>
                            <div className='flex flex-col flex-1'>
                                <div className='flex justify-between gap-2'>
                                    <p>{selectedUser?.fullName}</p>
                                </div>
                            </div>
                        </div>
                        {/* Scrollable messages area */}
                        <div className='flex-1 flex flex-col overflow-y-auto'>
                            <Messages />
                        </div>
                        {/* Sticky input for mobile */}
                        <div className={`${isMobile ? 'sticky bottom-0 z-10 bg-white' : 'pt-2'}`}>
                            <SendInput />
                        </div>
                    </div>
                ) : (
                    <div className='md:min-w-[550px] flex flex-col justify-center items-center h-full w-full flex-1'>
                        <h1 className='text-4xl text-black font-bold'>Hi,{authUser?.fullName} </h1>
                        <h1 className='text-2xl text-black'>Let's start conversation</h1>

                    </div>
                )
            }
        </>

    )
}

export default MessageContainer