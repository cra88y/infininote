import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { createNote, loadNotes, setActiveNote } from "../../store/note";
import UserNotes from "./UserNotes";
import "./app.css";
import CreateNote from "./CreateNote";

export default function ApplicationPage() {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  const notes = useSelector((state) => state.notes.notes);
  const noteid = Object.keys(notes)[0];
  const dispatch = useDispatch();
  const activeNote = useSelector((state) => state.notes.activeNote);

  useEffect(() => {
    dispatch(loadNotes());
  }, [sessionUser]);
  if (!sessionUser) {
    history.push("/");
    return <></>;
  }
  return (
    <div>
      <h1>Welcome back, {sessionUser.username}!</h1>
      <div className="application-container">
        <div className="user-notes">
          <UserNotes />
        </div>
        <CreateNote />
      </div>
    </div>
  );
}
