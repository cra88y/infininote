import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LoginFormModal from "../LoginFormModal";
import "./landing.css";
export default function LandingPage() {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="landing-flex">
      <div className="landing-content-flex">
        <h1 className="landing-title">Tame your work, organize your life</h1>
        <p className="landing-paragraph">
          Remember everything and tackle any project with your notes, tasks, and
          schedule all in one place.
        </p>
        <NavLink to="/signup" className="nav-btn">
          Sign up for free
        </NavLink>
        <LoginFormModal />
      </div>
    </div>
  );
}
