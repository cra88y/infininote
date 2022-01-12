import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import * as sessionActions from "../../store/session";
import LoginFormModal from "../LoginFormModal";
import "./landing.css";
export default function LandingPage() {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.loginDemo());
  };
  return (
    <div className="landing-flex">
      <div className="landing-content-flex">
        <div>
          <h1 className="landing-title">Tame your work, organize your life</h1>
          <p className="landing-paragraph">
            Remember everything and tackle any project with your notes, tasks,
            and schedule all in one place.
          </p>
        </div>
        <div className="flex">
          <NavLink to="/signup" className="nav-btn">
            Sign Up
          </NavLink>

          <button onClick={handleSubmit} className="nav-btn">
            Demo
          </button>
        </div>
        <LoginFormModal />
      </div>
    </div>
  );
}
