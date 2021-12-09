import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNote, setActiveNote } from "../../store/note";
import MDEditor from "@uiw/react-md-editor";

export default function CreateNote() {
  const sessionUser = useSelector((state) => state.session.user);
  // const notes = useSelector((state) => state.notes.notes);
  const activeNote = useSelector((state) => state.notes.activeNote);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteId, setNoteId] = useState(null);
  const [isEditing, setEditing] = useState(false);
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
  useEffect(() => {
    onFormChange();
  }, [title, content]);

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
      setEditing(didMatch);
    } else {
      reset();
    }
  }, [activeNote]);
  const noteDisplay = (
    <>
      <h3
        onClick={() => {
          setEditing((prev) => !prev);
        }}
        className="note-title"
      >
        {title}
      </h3>
      <div
        onClick={() => {
          setEditing((prev) => !prev);
        }}
      >
        <MDEditor.Markdown source={content} className="note-textarea" />
      </div>
    </>
  );
  const noteEditor = (
    <div>
      {/* <label htmlFor="title">Title</label> */}
      <input
        onClick={(e) => e.stopPropagation()}
        className="note-title"
        placeholder="Untitled"
        name="title"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        value={title}
      />
      <MDEditor
        preview={"edit"}
        height="1000"
        onFocus={(e) => setEditing(true)}
        placeholder={` - milk\n - eggs\n - bread`}
        name="content"
        className="note-textarea"
        onChange={(val) => {
          setContent(val);
        }}
        value={content}
      />
    </div>
  );

  return (
    <div
      onBlur={(e) => {
        const currentTarget = e.currentTarget;
        setTimeout(() => {
          // Check if the new activeElement is a child of the original container
          if (!currentTarget.contains(document.activeElement)) {
            // You can invoke a callback or add custom logic here
            setEditing(false);
          }
        }, 0);
      }}
      onFocus={(e) => {
        setEditing(true);
      }}
      onClick={(e) => {
        setEditing(true);
      }}
      className="create-note"
    >

      <div>{isEditing || !noteId ? noteEditor : noteDisplay}</div>
    </div>
  );
}
