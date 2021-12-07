import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNote, setActiveNote } from "../../store/note";

export default function CreateNote() {
  const sessionUser = useSelector((state) => state.session.user);
  const notes = useSelector((state) => state.notes.notes);
  const activeNote = useSelector((state) => state.notes.activeNote);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const reset = () => {
    // setTitle("");
    // setContent("");
    dispatch(setActiveNote(null));
    console.log(activeNote);
  };
  useEffect(() => {
    console.log(activeNote);
    if (activeNote) {
      setTitle(activeNote.title || "");
      setContent(activeNote.content || "");
    } else {
      reset();
    }
  }, [activeNote]);

  const onFormChange = (e) => {
    const noteObj = {
      id: activeNote?.id,
      userid: sessionUser.id,
      title,
      content,
    };
    dispatch(createNote(noteObj));
  };
  return (
    <div className="create-note">
      <button
        onClick={(e) => {
          reset();
          onFormChange(e);
        }}
      >
        New Note
      </button>
      <form onBlur={onFormChange} onFocus={(e) => onFormChange(e)}>
        <label htmlFor="title">Title</label>
        <input
          name="title"
          onChange={(e) => {
            onFormChange(e);
            setTitle(e.target.value);
          }}
          value={title}
        />
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          className="note-textarea"
          onChange={(e) => {
            onFormChange(e);
            setContent(e.target.value);
          }}
          value={content}
        />
      </form>
    </div>
  );
}
