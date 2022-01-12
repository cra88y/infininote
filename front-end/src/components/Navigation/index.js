import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import "./nav.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = <ProfileButton user={sessionUser} />;
  } else {
    sessionLinks = (
      <>
        <NavLink to="/signup" className="nav-btn">
          Sign Up
        </NavLink>
        <LoginFormModal />
      </>
    );
  }

  return (
    <div className="nav-bar">
      <NavLink exact to="/" className="navlink-nostyle">
        <div className="logo-box">InfiniNote</div>
      </NavLink>
      <div className="nav-right">{isLoaded && sessionLinks}</div>
    </div>
  );
}

export default Navigation;
