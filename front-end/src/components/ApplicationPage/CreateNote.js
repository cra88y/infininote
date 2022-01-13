import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNote, setActiveNote } from "../../store/note";
import MDEditor from "@uiw/react-md-editor";
export default function CreateNote({
  setActiveCollection,
  collections,
  isEditing,
  setEditing,
}) {
  const sessionUser = useSelector((state) => state.session.user);
  // const notes = useSelector((state) => state.notes.notes);
  const activeNote = useSelector((state) => state.notes.activeNote);
  const activeCollection = useSelector(
    (state) => state.collections.activeCollection
  );
  const notes = useSelector((state) => state.notes.notes);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteId, setNoteId] = useState(null);
  const [changingCollection, setChangingCollection] = useState(false);
  const [errors, setErrors] = useState([]);
  const collectionNameFromId = (id) => {
    return (
      Object.values(collections).find((coll) => {
        return coll.id == id;
      })?.name || null
    );
  };
  const collectionObjFromName = (name) => {
    return (
      Object.values(collections).find((coll) => {
        return coll.name == name;
      }) || null
    );
  };
  const collectionObjFromId = (id) => {
    return (
      Object.values(collections).find((coll) => {
        return coll.id == id;
      }) || null
    );
  };
  // console.log(
  //   "activeNoteCollName: " + collectionNameFromId(activeNote?.collectionid)
  // );
  const onFormChange = (e) => {
    const valErrors = [];
    if (!noteId && !title.length && !content.length) {
      setErrors(valErrors);
      setEditing(true);
      return;
      // return;
    }
    if (!title.length) {
      valErrors.push("Note name is too short".toUpperCase());
    }
    if (title.length > 80) {
      valErrors.push("Note name is too long".toUpperCase());
    }
    if (content.length > 9999) {
      valErrors.push("Note length must be < 9999 characters".toUpperCase());
    }
    if (valErrors.length == 0) {
      setTimeout(async () => {
        // console.log(activeNote);
        // console.log(noteId);
        // console.log("note save on in CreateNote".toUpperCase());
        const noteObj = {
          id: activeNote?.id,
          userid: sessionUser.id,
          collectionid:
            noteId != null && changingCollection == false
              ? activeNote?.collectionid
              : activeCollection?.all
              ? null
              : activeCollection?.id,
          title,
          content,
        };
        // await dispatch(setActiveNote(noteObj));
        await dispatch(createNote(noteObj));
        setChangingCollection(false);
      }, 0);
    }
    setErrors(valErrors);
  };

  useEffect(() => {
    if (isEditing) {
      onFormChange();
    }
  }, [title, content, activeNote]);
  const resetActiveNote = () => {
    setTitle("");
    setContent("");
    setNoteId(null);
    // await dispatch(setActiveNote(null));
  };

  useEffect(() => {
    setErrors([]);
    if (activeNote) {
      let didMatch = false;
      if (!noteId) {
        const titleComp = title[0];
        const newTitleComp = activeNote?.title?.slice(0, 1);
        if (titleComp == newTitleComp) didMatch = true;
      }
      // console.log("content", content);
      // console.log("active", activeNote.content);
      // console.log(didMatch);
      const addToTitle = didMatch ? title : "";
      const addToContent = didMatch ? content : "";
      setTitle(addToTitle || activeNote.title || "");
      setContent(addToContent || activeNote.content || "");
      setNoteId(activeNote.id || null);
      // setEditing(didMatch);
      if (didMatch) {
        onFormChange();
      }
    } else {
      resetActiveNote();
    }
  }, [activeNote]);

  // useEffect(async () => {
  //   console.log(1);
  //   const noteObj = Object.values(notes || {}).find((note) => {
  //     return note?.id == activeNote?.id;
  //   });
  //   if (noteObj?.title != activeNote?.title)
  //     await dispatch(setActiveNote(noteObj));
  // }, [activeCollection]);

  const noteDisplay = (
    <>
      <h3
        onClick={() => {
          setEditing((prev) => !prev);
        }}
        className="note-title"
      >
        {title}
        <span className="updated-string">
          {new Date(activeNote?.updatedAt).toLocaleString()}
        </span>
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
      <div>
        <input
          maxLength={80}
          onClick={(e) => e.stopPropagation()}
          className="note-title"
          autoFocus={!noteId}
          placeholder="Untitled"
          name="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
        />
        {/* <span className="flex-v-center">Notebook: </span> */}
        {collections == null ? (
          <span>No Notebooks</span>
        ) : (
          <select
            // value={
            //   activeNote?.collectionid != null
            //     ? collectionNameFromId(activeNote?.collectionid) || "None"
            //     : noteId == null
            //     ? collectionNameFromId(activeCollection?.id) || "None"
            //     : "None"
            // }
            value={
              activeNote?.collectionid != null
                ? activeNote?.collectionid || "None"
                : noteId == null
                ? activeCollection?.id || "None"
                : "None"
            }
            onChange={async (e) => {
              setChangingCollection(true);
              // const selectedIndex = e.target.options.selectedIndex;
              // const collid =
              //   e.target.options[selectedIndex].getAttribute("data-key") ||
              //   null;
              // console.log("collid" + collid);
              const collObj = collectionObjFromId(e.target.value);
              if (e.target.value == "None")
                await dispatch(setActiveCollection({ all: true }));
              else {
                await dispatch(setActiveCollection(collObj));
              }
              const noteObj = {
                id: activeNote?.id,
                userid: sessionUser.id,
                collectionid: collObj?.id,
                title,
                content,
              };
              await dispatch(setActiveNote(noteObj));
            }}
          >
            <option>None</option>
            {Object.values(collections).map((coll) => (
              <option key={coll.id} value={coll.id}>
                {coll.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <MDEditor
        highlightEnable={false}
        autoFocus={noteId}
        preview={"edit"}
        visiableDragbar={false}
        height={window.screen.height * 0.65}
        // onFocus={(e) => setEditing(true)}
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
        // console.log("ay");
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
      className={`create-note threedee ${errors.length ? "problem" : ""}`}
    >
      {errors.length > 0 && (
        <>
          {/* <span className="error-item">SAVE PREVENTED</span> */}
          <ul>
            {errors.map((err) => {
              return (
                <li className="error-item" key={err}>
                  {err}
                </li>
              );
            })}
          </ul>
        </>
      )}
      <div>{isEditing || !noteId ? noteEditor : noteDisplay}</div>
    </div>
  );
}
