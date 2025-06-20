import Signup from './components/Signup';
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect, useRef } from 'react';
import {useSelector,useDispatch} from "react-redux";
import io from "socket.io-client";
import { setOnlineUsers } from './redux/userSlice';
import { BASE_URL } from '.';
import Profile from './components/Profile';
import React from 'react';

export const SocketContext = React.createContext(null);

const router = createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path: "/profile",
    element: <Profile />
  },
])

function App() { 
  const {authUser} = useSelector(store=>store.user);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(()=>{
    if(authUser){
      const socketio = io(`${BASE_URL}`, {
          query:{
            userId:authUser._id
          }
      });
      socketRef.current = socketio;
      socketio?.on('getOnlineUsers', (onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });
      return () => socketio.close();
    }else{
      if(socketRef.current){
        socketRef.current.close();
        socketRef.current = null;
      }
    }
  },[authUser, dispatch]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      <div className="p-4 h-screen flex items-center justify-center">
        <RouterProvider router={router}/>
      </div>
    </SocketContext.Provider>
  );
}

export default App;
