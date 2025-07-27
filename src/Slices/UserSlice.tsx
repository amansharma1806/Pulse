import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const userSlice=createSlice({
    name:'user',
    initialState:localStorage.getItem('token')?jwtDecode(localStorage.getItem('token')||''):{},
    reducers:{
       
        setUser:(state)=>{
            return state;
        },
        removeUser:(state)=>{
            state={};
            return state;
        }

    }
})
export const {removeUser,setUser}=userSlice.actions;
export default userSlice.reducer;