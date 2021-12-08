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
  const [noteId, setNoteId] = useState(null);

  const onFormChange = (e) => {
    if (!title.length) return;
    const noteObj = {
      id: activeNote?.id,
      userid: sessionUser.id,
      title,
      content,
    };
    dispatch(createNote(noteObj));
  };
  const reset = () => {
    dispatch(setActiveNote(null));
  };
  useEffect(() => {
    console.log(noteId);
    if (activeNote) {
      let didMatch = false;
      if (!noteId) {
        const titleComp = title[0];
        const newTitleComp = activeNote?.title?.slice(0, 1);
        if (titleComp == newTitleComp) didMatch = true;
        console.log(didMatch);
      }
      const addToTitle = didMatch ? title : "";
      const addToContent = didMatch ? content : "";
      setTitle(addToTitle || activeNote.title || "");
      setContent(addToContent || activeNote.content || "");
      setNoteId(activeNote.id || null);
    } else {
      reset();
    }
  }, [activeNote]);

  return (
    <div className="create-note">
      <button
        onClick={(e) => {
          if (activeNote) {
            onFormChange(e);
            reset();
          }
        }}
      >
        New Note
      </button>
      <form onBlur={onFormChange} onFocus={(e) => onFormChange(e)}>
        {/* <label htmlFor="title">Title</label> */}
        <input
          className="note-title"
          placeholder="Grocery List"
          name="title"
          onChange={(e) => {
            setTitle(e.target.value);
            onFormChange(e);
          }}
          value={title}
        />
        {/* <label htmlFor="content">Content</label> */}
        <textarea
          placeholder={` - milk\n - eggs\n - bread`}
          name="content"
          className="note-textarea"
          onChange={(e) => {
            setContent(e.target.value);
            onFormChange(e);
          }}
          value={content}
        />
      </form>
    </div>
  );
}
