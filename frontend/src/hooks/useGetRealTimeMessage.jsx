import { useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { useEffect, useContext } from "react";
import { SocketContext } from '../App';

const useGetRealTimeMessage = () => {
    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;
        const handler = (newMessage) => {
            dispatch(setMessages(prev => [...(prev || []), newMessage]));
        };
        socket.on("newMessage", handler);
        return () => socket.off("newMessage", handler);
    }, [dispatch, socket]);
};
export default useGetRealTimeMessage;