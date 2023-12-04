import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URI;
const userInfoJson = localStorage.getItem('userInfo');
const userInfo = userInfoJson ? JSON.parse(userInfoJson) : {};

export const logoutUser = createAsyncThunk("user/logout", async(payload, thunkAPI) => {
    try {
        const { data } = await axios.get(`${apiUrl}/api/logout`, {
            withCredentials: true,
        });
        // let userInfo = thunkAPI.getState().userLoggedIn.userInfo
        if (data === "access token cleared") {
            localStorage.removeItem("userInfo");
            window.location.href = "/"
            thunkAPI.dispatch(setRedxUserState({}));
        }
    } catch (error) {
        console.log(error)
    }
})

export const loginRegisterSlice = createSlice({
    name: "handling_login_register",
    initialState: {
        userInfo: userInfo
    },
    reducers: {
        setRedxUserState(state, action) {
            state.userInfo = {
                ...state.userInfo, ...action.payload
            }
        }
    }
})
export const { setRedxUserState } = loginRegisterSlice.actions
export default loginRegisterSlice.reducer
