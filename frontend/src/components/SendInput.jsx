import {useState, useRef} from 'react'
import { IoSend } from "react-icons/io5";
import { FiPaperclip } from "react-icons/fi";
import axios from "axios";
import {useDispatch,useSelector} from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.user);
    const {messages} = useSelector(store=>store.message);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/message/send/${selectedUser?._id}`, {message}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            dispatch(setMessages([...messages, res?.data?.newMessage]))
        } catch (error) {
            console.log(error);
        } 
        setMessage("");
    }

    const handleAttachmentClick = () => {
        setShowDropdown((prev) => !prev);
    };

    const handlePhotoClick = () => {
        setShowDropdown(false);
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            const uploadRes = await axios.post(
                `${BASE_URL}/api/v1/message/upload-image`,
                formData,
                { withCredentials: true }
            );
            const imageUrl = uploadRes.data.url;
            // Send image message
            const res = await axios.post(`${BASE_URL}/api/v1/message/send/${selectedUser?._id}`,
                { image: imageUrl },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            dispatch(setMessages([...messages, res?.data?.newMessage]))
        } catch (error) {
            console.log(error);
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='px-4 my-3'>
            <div className='w-full relative flex items-center'>
                {/* Attachment Icon */}
                <div className='relative'>
                    <button type="button" onClick={handleAttachmentClick} className='p-2 text-xl text-gray-400 hover:text-white focus:outline-none'>
                        <FiPaperclip />
                    </button>
                    {showDropdown && (
                        <div className="absolute bottom-10 left-0 mb-2 w-32 bg-white dark:bg-zinc-800 rounded shadow-lg z-10 animate-fade-in-up">
                            <button type="button" onClick={handlePhotoClick} className="block w-full text-left px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-700">Photos</button>
                        </div>
                    )}
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </div>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder='Send a message...'
                    className='border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white ml-2'
                    disabled={uploading}
                />
                <button type="submit" className='absolute flex inset-y-0 end-0 items-center pr-4' disabled={uploading}>
                    <IoSend />
                </button>
            </div>
        </form>
    )
}

export default SendInput