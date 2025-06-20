import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { useEffect, useContext } from "react";
import { SocketContext } from '../App';

const useGetRealTimeMessage = () => {
    const socket = useContext(SocketContext);
    const dispatch = useDispatch();
    const messages = useSelector(store => store.message.messages);

    useEffect(() => {
        if (!socket) return;
        const handler = (newMessage) => {
            dispatch(setMessages([...(messages || []), newMessage]));
        };
        socket.on("newMessage", handler);
        return () => socket.off("newMessage", handler);
    }, [dispatch, socket, messages]);
};
export default useGetRealTimeMessage;