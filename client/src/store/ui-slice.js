import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  themeModalIsOpen: false,
  editProfileModalOpen: false,
  editPostModalOpen: false,
  postToEdit: "",
  theme: JSON.parse(localStorage.getItem("theme")) || {
    primaryColor: "",
    backgroundColor: "",
    textColor: "",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openThemeModal: (state) => {
      state.themeModalIsOpen = true;
    },
    closeThemeModal: (state) => {
      state.themeModalIsOpen = false;
    },
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },
    openEditProfileModal: (state) => {
      state.editProfileModalOpen = true;
    },
    closeEditProfileModal: (state) => {
      state.editProfileModalOpen = false;
    },
    openEditPostModal: (state, action) => {
      state.editPostModalOpen = true;
      state.postToEdit = action.payload;
    },
    closeEditPostModal: (state) => {
      state.editPostModalOpen = false;
      state.postToEdit = "";
    },
  },
});

export const uiSliceActions = uiSlice.actions;
export default uiSlice;
