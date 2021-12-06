import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNote, deleteNote, loadNotes } from "../../store/note";
export default function UserNotes() {
  const sessionUser = useSelector((state) => state.session.user);
  const notes = useSelector((state) => state.notes.notes);
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(
    //   createNote({
    //     userid: sessionUser.id,
    //     title: "Test!",
    //     content: "note body!",
    //   })
    // );
    dispatch(loadNotes());
  }, [sessionUser.id]);
  const onDeleteClick = (note) => {
    dispatch(deleteNote(note));
  };
  let notesDisplay = null;
  if (Object.keys(notes).length > 0) {
    notesDisplay = Object.values(notes).map((note) => {
      return (
        <div key={note.id} className="note-card">
          <h3 className="note-title">{note.title}</h3>
          <p className="note-body">{note.content}</p>
          <button onClick={() => onDeleteClick(note)}>Delete</button>
        </div>
      );
    });
  } else {
    notesDisplay = <h1>You haven't created any notes yet!</h1>;
  }
  return notesDisplay;
}
