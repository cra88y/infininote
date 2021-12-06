import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNote } from "../../store/note";

export default function CreateNote() {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const reset = () => {
    setTitle("");
    setContent("");
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const noteObj = { userid: sessionUser.id, title, content };
    dispatch(createNote(noteObj));
    reset();
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          className="note-textarea"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        <button>Create note!</button>
      </form>
    </div>
  );
}
