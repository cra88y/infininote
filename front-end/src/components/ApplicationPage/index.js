import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { createNote, loadNotes } from "../../store/note";
import UserNotes from "./UserNotes";
import "./app.css";
import CreateNote from "./CreateNote";

export default function ApplicationPage() {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  if (!sessionUser) {
    history.push("/");
    return <></>;
  } else
    return (
      <div>
        <h1>Application</h1>
        <CreateNote />
        <div className="user-notes">
          <UserNotes />
        </div>
      </div>
    );
}
