import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  lenShop: 0,
  userCode: [],
  imagePath: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userCodeSet: (state, action) => {
      state.userCode = action.payload
    },
    imagePathSet: (state, action) => {
      state.imagePath = action.payload
    },

    lengthShop: (state, action) => {
      state.lenShop = action.payload;
    },
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signoutUserStart: (state) => {
      state.loading = true;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signoutFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  userCodeSet,
  imagePathSet,
  lengthShop,
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteFailure,
  deleteSuccess,
  deleteUserStart,
  signoutFailure,
  signoutSuccess,
  signoutUserStart,
} = userSlice.actions;

export default userSlice.reducer;
