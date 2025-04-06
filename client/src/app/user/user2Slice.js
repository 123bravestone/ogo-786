import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loginUser: null,
    logoutUser: null,
    userListing: null,
    userLocation: null,
};

const user2Slice = createSlice({
    name: "user2",
    initialState,
    reducers: {
        // successfulLogin: (state, action) => {
        //     state.mobileNumber = action.payload.mobileNumber;
        //     state.username = action.payload.username;
        //     state.isAuthenticated = true;
        // },
        // logout: (state) => {
        //     state.mobileNumber = "";
        //     state.username = "";
        //     state.isAuthenticated = false;
        // },
        loginSet: (state, action) => {
            state.loginUser = action.payload;

        },
        logoutSet: (state, action) => {
            state.logoutUser = action.payload;
        },
        userListingSet: (state, action) => {
            state.userListing = action.payload
        },
        userLocationSet: (state, action) => {
            state.userLocation = action.payload
        },
    },
});

export const {
    loginSet,
    logoutSet,
    userListingSet,
    userLocationSet,
} = user2Slice.actions;
export default user2Slice.reducer;
