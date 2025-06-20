import { useEffect } from 'react'
import axios from "axios";
import {useSelector,useDispatch} from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const useGetMessages = () => {
    const {selectedUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser) return;
            try {
                const res = await axios.get(`${BASE_URL}/api/v1/message/${selectedUser._id}`, { withCredentials: true });
                dispatch(setMessages(res.data))
            } catch (error) {
                console.log(error);
            }
        }
        fetchMessages();
    }, [selectedUser, dispatch]);
}

export default useGetMessages