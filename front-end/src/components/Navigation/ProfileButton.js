import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";

function ProfileButton({ user }) {
  const savedTheme = localStorage.getItem("theme");
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState(savedTheme);
  const [dark, setDark] = useState(false);
  const userTheme = useSelector((state) => state.session.theme);
  const openMenu = (e) => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    dispatch(sessionActions.setUserTheme(Number(theme)));
  }, [theme]);

  useEffect(() => {
    dispatch(sessionActions.setUserDark(dark));
  }, [dark]);
  useEffect(() => {
    if (!showMenu) return;
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logoutUser());
  };

  return (
    <div
      onBlur={(e) => {
        const currentTarget = e.currentTarget;
        setTimeout(() => {
          // Check if the new activeElement is a child of the original container
          if (!currentTarget.contains(document.activeElement)) {
            // You can invoke a callback or add custom logic here
            closeMenu();
          }
        }, 0);
      }}
    >
      <div
        className="profile-btn util-btn"
        onClick={openMenu}
        onBlur={openMenu}
      >
        <i className="fas fa-user-circle" />
      </div>
      {showMenu && (
        <ul onClick={(e) => e.stopPropagation()} className="profile-dropdown">
          <li>{user.username}</li>
          <li>{user.email}</li>
          <li>
            <span>Theme:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
              }}
            />
            {/* <span>Dark:</span>
            <input
              type="checkbox"
              value={theme}
              onChange={(e) => setDark(e.target.checked)}
            /> */}
          </li>
          <li>
            <button className="util-btn" onClick={logout}>
              Log Out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
