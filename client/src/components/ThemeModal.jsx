import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiSliceActions } from "../store/ui-slice";

const ThemeModal = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  const closeModal = () => {
    dispatch(uiSliceActions.closeThemeModal());
  };
  const closeThemeModal =(e)=>{
    if(e.target.classList.contains('them')){
      dispatch(uiSliceActions.closeThemeModal());
    }
  }

  const changeBackgroundColor = (color) => {
    const updatedTheme = { ...theme, backgroundColor: color };
    dispatch(uiSliceActions.changeTheme(updatedTheme));
    localStorage.setItem("theme", JSON.stringify(updatedTheme));
  };

  const changePrimaryColor = (color) => {
    const updatedTheme = { ...theme, primaryColor: color };
    dispatch(uiSliceActions.changeTheme(updatedTheme));
    localStorage.setItem("theme", JSON.stringify(updatedTheme));
  };

  return (
    <section className="theme" onClick={e=>closeThemeModal(e)}>
      <button className="theme_close_btn" onClick={closeModal}>Close</button> {/* ✅ Close Btn */}

      <div className="theme_container">
        <article className="theme_primary">
          <h3>Primary Colors</h3>
          <ul>
            <li onClick={() => changePrimaryColor("red")}></li>
            <li onClick={() => changePrimaryColor("blue")}></li>
            <li onClick={() => changePrimaryColor("yellow")}></li>
            <li onClick={() => changePrimaryColor("green")}></li>
            <li onClick={() => changePrimaryColor("purple")}></li>
          </ul>
        </article>

        <article className="theme_background">
          <h3>Background Colors</h3>
          <ul>
            <li onClick={() => changeBackgroundColor("white")}></li>
            <li onClick={() => changeBackgroundColor("black")}></li>
          </ul>
        </article>
      </div>
    </section>
  );
};

export default ThemeModal;
