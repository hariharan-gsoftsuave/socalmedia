import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiSliceActions } from "../store/ui-slice";

const ThemeModal = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  // ✅ Click outside modal to close
  const closeThemeModal = (e) => {
    if (e.target.classList.contains("theme-overlay")) {
      dispatch(uiSliceActions.closeThemeModal());
    }
  };

  const changeBackgroundColor = (color) => {
    const updatedTheme = { ...theme, backgroundColor: color };
    dispatch(uiSliceActions.changeTheme(updatedTheme));
    localStorage.setItem("theme", JSON.stringify(updatedTheme));
    document.body.classList.remove('theme1', 'theme2');
    if(color !== "none"){
      document.body.classList.add(color);
    }
  };

  const changePrimaryColor = (color) => {
    const updatedTheme = { ...theme, primaryColor: color };
    dispatch(uiSliceActions.changeTheme(updatedTheme));
    localStorage.setItem("theme", JSON.stringify(updatedTheme));
    document.body.classList.remove('red', 'blue', 'yellow', 'green', 'purple', 'white', 'dark', 'dev');
    if(color !== "none"){
      document.body.classList.add(color);
    }
  };

  return (
    <section className="theme-overlay" onClick={closeThemeModal}>
      <div className="theme">
        <div className="theme_container">
          <article className="text-black">
            <h3>Primary Colors</h3>
            <ul className="d-flex gap-5 mb-5">
              <li className="red" onClick={() => changePrimaryColor("red")}></li>
              <li className="blue" onClick={() => changePrimaryColor("blue")}></li>
              <li className="yellow" onClick={() => changePrimaryColor("yellow")}></li>
              <li className="green" onClick={() => changePrimaryColor("green")}></li>
              <li className="purple" onClick={() => changePrimaryColor("purple")}></li>
            </ul>
            <ul className="d-flex gap-5 m-0 mb-5">
              <li className="white" onClick={() => changePrimaryColor("white")}></li>
              <li className="black" onClick={() => changePrimaryColor("dark")}></li>
              <li className="dev" onClick={() => changePrimaryColor("dev")}></li>
              <li className="none" onClick={() => changePrimaryColor("")}></li>
            </ul>
          </article>

          <article className="text-black">
            <h3>Theme</h3>
            <ul className="d-flex gap-5 mb-4">
              <li className="" onClick={() => changeBackgroundColor("none")}></li>
              <li className="theme1" onClick={() => changeBackgroundColor("theme1")}></li>
              <li className="theme2"onClick={() => changeBackgroundColor("theme2")}></li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ThemeModal;
