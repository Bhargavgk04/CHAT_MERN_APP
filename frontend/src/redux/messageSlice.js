import {createSlice} from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState:{
        messages:null,
    },
    reducers:{
        setMessages:(state,action)=>{
            if (typeof action.payload === 'function') {
                state.messages = action.payload(state.messages || []);
            } else {
                state.messages = action.payload;
            }
        }
    }
});
export const {setMessages} = messageSlice.actions;
export default messageSlice.reducer;