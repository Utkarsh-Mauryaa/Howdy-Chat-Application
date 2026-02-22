import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: null,
    isAdmin: false,
    userLoading: true,
    adminLoading: true
}
const authSlice = createSlice({
name: "auth",
initialState,
reducers: {
    userExists: (state, action) => {
        state.user = action.payload;
        state.userLoading = false;
    },
    userNotExists: (state) => {
        state.user = null;
        state.userLoading = false;
    },
    adminExists: (state, action) => {
        state.isAdmin = action.payload,
        state.adminLoading = false
    },
    adminNotExists: (state) => {
        state.isAdmin = false,
        state.adminLoading = false
    }
},
})


export default authSlice;
export const { userExists, userNotExists, adminExists, adminNotExists } = authSlice.actions;