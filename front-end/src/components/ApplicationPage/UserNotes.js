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
  const activeCollection = useSelector(
    (state) => state.collections.activeCollection
  );

  const dispatch = useDispatch();
  const resetActiveNote = () => {
    dispatch(setActiveNote(null));
  };
  let notesDisplay = null;
  let notesArray = [...Object.values(notes)];
  notesArray.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  if (activeCollection?.all) {
  } else {
    notesArray = notesArray.filter((note) => {
      return note.collectionid == activeCollection?.id;
    });
  }
  // console.log(notesArray);
  if (notesArray.length > 0) {
    notesDisplay = notesArray.map((note) => {
      const notePreview = note.content
        .replace(/[:*~#\[\]\]]/gm, "")
        .slice(0, 150);
      // console.log(note.id);
      return (
        <div
          onClick={() => {
            dispatch(setActiveNote(note));
          }}
          key={note.id}
          className={`note-card ${note.id == activeNote?.id ? "selected" : ""}`}
        >
          <div className="note-preview">
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
          <div className="note-card-utils">
            <button
              className="delete-btn util-btn"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteNote(note));
              }}
            >
              Delete
            </button>
            <p className="updated-string">
              {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      );
    });
  } else {
    notesDisplay = <div className="note-card">No notes yet!</div>;
  }
  return notesDisplay;
}
