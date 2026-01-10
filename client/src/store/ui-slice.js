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
    // Theme Modal
    openThemeModal: (state) => {
      state.themeModalIsOpen = true;
    },
    closeThemeModal: (state) => {
      state.themeModalIsOpen = false;
    },

    // Theme Change
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },

    // Edit Profile Modal
    openEditProfileModal: (state) => {
      state.editProfileModalOpen = true;
    },
    closeEditProfileModal: (state) => {
      state.editProfileModalOpen = false;
    },

    //  Edit Post Modal
    openEditPostModal: (state, action) => {
      state.editPostModalOpen = true;
      state.postToEdit = action.payload;
    },
    closeEditPostModal: (state) => {
      state.editPostModalOpen = false;
      state.postToEdit = "";
    },
    // Loading State
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // ✅ Close all modals (use in sidebar before opening theme)
    closeAllModals: (state) => {
      state.themeModalIsOpen = false;
      state.editProfileModalOpen = false;
      state.editPostModalOpen = false;
      state.postToEdit = "";
    }
  },
});

export const uiSliceActions = uiSlice.actions;
export default uiSlice;
