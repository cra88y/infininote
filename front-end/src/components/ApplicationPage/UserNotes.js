import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNote,
  deleteNote,
  loadNotes,
  setActiveNote,
} from "../../store/note";
export default function UserNotes() {
  const sessionUser = useSelector((state) => state.session.user);
  const notes = useSelector((state) => state.notes.notes);
  const activeNote = useSelector((state) => state.notes.activeNote);
  const dispatch = useDispatch();
  const onDeleteClick = (note) => {
    dispatch(deleteNote(note));
  };
  let notesDisplay = null;
  const notesArray = [...Object.values(notes)];
  if (notesArray.length > 0) {
    notesArray.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    notesDisplay = notesArray.map((note) => {
      // console.log(note.id);
      return (
        <div
          onClick={() => dispatch(setActiveNote(note))}
          key={note.id}
          className={`note-card ${note.id == activeNote?.id ? "selected" : ""}`}
        >
          <div>
            <h3 className="note-title">{note.title}</h3>
            <p className="note-body">{note.content}</p>
          </div>
          <button onClick={() => onDeleteClick(note)}>Delete</button>
        </div>
      );
    });
  } else {
    notesDisplay = <h2>You haven't created any notes yet!</h2>;
  }
  return notesDisplay;
}
