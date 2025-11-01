import { createSlice } from "@reduxjs/toolkit";


const initialState = {themeModelIsOpen: false, editProfileModalOpen: false,
    editPostModalOpen: false, postToEdit: "", theme:JSON.parse(localStorage.getItem("theme")) || {primaryColor:"",breakgroundColor:"",textColor:""}};    


const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openThemeModel:(state)=> {
            state.themeModelIsOpen = true;
        },
        closeThemeModel:(state)=> {
            state.themeModelIsOpen = false;
        },
        changeTheme:(state,action)=> {
            state.theme = action.payload;
        },
        openEditProfileModel:(state)=> {
            state.editProfileModalOpen = true;
        },
        closeEditProfileModal:(state)=> {
            state.editProfileModalOpen = false; 
        },
        openEditPostModal:(state, action)=> {
            state.editPostModalOpen = true; 
            state.postToEdit = action.payload;
        },
        closeEditPostModal:(state)=> {
            state.editPostModalOpen = false; 
            state.postToEdit = "";
        },
        
    }
});

export const {uiSliceActions} = uiSlice.actions;
export default uiSlice;