import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNote,
  deleteNote,
  loadNotes,
  setActiveNote,
} from "../../store/note";
import MDEditor from "@uiw/react-md-editor";

export default function UserNotes() {
  // const sessionUser = useSelector((state) => state.session.user);
  const notes = useSelector((state) => state.notes.notes);
  const activeNote = useSelector((state) => state.notes.activeNote);
  const dispatch = useDispatch();
  const onDeleteClick = (e, note) => {
    e.stopPropagation();
    dispatch(deleteNote(note));
  };

  let notesDisplay = null;
  const notesArray = [...Object.values(notes)];
  if (notesArray.length > 0) {
    notesArray.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    notesDisplay = notesArray.map((note) => {
      const notePreview = note.content
        .replace(/[^a-zA-Z\d\s.]/gm, "")
        .slice(0, 20);
      // console.log(note.id);
      return (
        <div
          onClick={() => dispatch(setActiveNote(note))}
          key={note.id}
          className={`note-card ${note.id == activeNote?.id ? "selected" : ""}`}
        >
          <div>
            <span className="note-title">{note.title}</span>
            <MDEditor.Markdown
              source={
                notePreview +
                (note.content.length > notePreview.length ? " . . ." : "")
              }
              className="note-body"
            />
            <br />
          </div>
          <button
            className="delete-btn"
            onClick={(e) => onDeleteClick(e, note)}
          >
            Delete
          </button>
        </div>
      );
    });
  } else {
    notesDisplay = (
      <p className="note-card">You haven't created any notes yet!</p>
    );
  }
  return notesDisplay;
}
