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
      return;
    }
    if (!title.length) {
      valErrors.push(" - Note name is too short!");
    }
    if (title.length > 80) {
      valErrors.push(" - Note name is too long!");
    }
    if (content.length > 3000) {
      valErrors.push(" - Note length must be < 3000 characters!");
    }
    if (valErrors.length == 0) {
      setTimeout(() => {
        // console.log(activeNote);
        // console.log(noteId);
        console.log("note save on in CreateNote");
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
        dispatch(createNote(noteObj));
        setChangingCollection(false);
      }, 0);
    }
    setErrors(valErrors);
  };

  useEffect(() => {
    if (isEditing) {
      onFormChange();
    }
  }, [title, content, activeCollection]);
  useEffect(() => {
    setEditing(false);
    // reset();
  }, [activeCollection]);
  const resetActiveNote = () => {
    setTitle("");
    setContent("");
    setNoteId(null);
    // dispatch(setActiveNote(null));
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
      if (!changingCollection) {
        const addToTitle = didMatch ? title : "";
        const addToContent = didMatch ? content : "";
        setTitle(addToTitle || activeNote.title || "");
        setContent(addToContent || activeNote.content || "");
      }
      setNoteId(activeNote.id || null);
      setEditing(didMatch);
      if (didMatch) {
        onFormChange();
      }
    } else {
      resetActiveNote();
    }
  }, [activeNote]);

  useEffect(() => {
    const noteObj = Object.values(notes || {}).find((note) => {
      return note?.id == activeNote?.id;
    });
    if (noteObj?.title != activeNote?.title) dispatch(setActiveNote(noteObj));
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
          onClick={(e) => e.stopPropagation()}
          className="note-title"
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
            onChange={(e) => {
              console.log(e.target.value);
              setChangingCollection(true);
              // const selectedIndex = e.target.options.selectedIndex;
              // const collid =
              //   e.target.options[selectedIndex].getAttribute("data-key") ||
              //   null;
              // console.log("collid" + collid);
              const collObj = collectionObjFromId(e.target.value);
              if (e.target.value == "None")
                dispatch(setActiveCollection({ all: true }));
              else {
                dispatch(setActiveCollection(collObj));
              }
              dispatch(
                setActiveNote({ ...activeNote, collectionid: collObj?.id })
              );
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
        preview={"edit"}
        visiableDragbar={false}
        height={window.outerHeight}
        onFocus={(e) => setEditing(true)}
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
      className="create-note"
    >
      {errors.length > 0 && (
        <>
          <span className="error-item">SAVE PREVENTED</span>
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
