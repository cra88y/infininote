import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { loadNotes, setActiveNote } from "../../store/note";
import UserNotes from "./UserNotes";
import CreateNote from "./CreateNote";
import "./app.css";
import {
  createCollection,
  loadCollections,
  loadcollections,
  setActiveCollection,
} from "../../store/collection";
export default function ApplicationPage() {
  const sessionUser = useSelector((state) => state.session.user);
  const activeNote = useSelector((state) => state.notes.activeNote);
  const activeCollection = useSelector(
    (state) => state.collections.activeCollection
  );
  const [collectionId, setCollectionId] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const collections =
    useSelector((state) => state.collections.collections) || {};
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadNotes());
    dispatch(loadCollections());
  }, [sessionUser]);
  // const notes = useSelector((state) => state.notes.notes);
  // const activeNote = useSelector((state) => state.notes.activeNote);
  console.log(activeCollection);
  console.log(collections);
  console.log(collectionId);
  const resetActiveNote = () => {
    dispatch(setActiveNote(null));
  };

  const resetActiveCollection = () => {
    dispatch(setActiveCollection(null));
  };
  useEffect(() => {
    if (!collectionName.length) return;
    const collectionObj = {
      id: activeCollection?.id,
      userid: sessionUser.id,
      name: collectionName,
    };
    dispatch(createCollection(collectionObj));
  }, [collectionName]);
  useEffect(() => {
    console.log("Active colleciton set");
    if (activeCollection) {
      let didMatch = false;
      if (!collectionId) {
        const collectionComp = collectionName[0];
        const newCollectionComp = activeCollection?.name?.slice(0, 1);
        if (collectionComp == newCollectionComp) didMatch = true;
      }
      const addToCollectionName = didMatch ? collectionName : "";
      setCollectionName(addToCollectionName || activeCollection.name || "");
      setCollectionId(activeCollection.id || null);
      setIsCreatingCollection(didMatch);
    } else {
      resetActiveCollection();
    }
  }, [activeCollection]);

  if (!sessionUser) {
    history.push("/");
    return <></>;
  }
  return (
    <>
      <div className="application-frame">
        <div className="application-container">
          <div>
            <h1 className="application-title">
              <strong>Welcome back, {sessionUser.username}!</strong>
            </h1>
            <div className="flex">
              <div className="collections-col">
                <div
                  className="collection-name"
                  onClick={(e) => dispatch(setActiveCollection({ all: true }))}
                >
                  All Notes
                </div>
                {Object.values(collections).map((coll) => (
                  <div
                    className={`collection-name ${
                      coll.id == activeCollection?.id ? "selected" : ""
                    }`}
                    key={coll.id}
                    onClick={(e) => dispatch(setActiveCollection(coll))}
                  >
                    {coll.name}
                  </div>
                ))}
                {isCreatingCollection == true ? (
                  <input
                    onBlur={(e) => {
                      const currentTarget = e.currentTarget;
                      setTimeout(() => {
                        // Check if the new activeElement is a child of the original container
                        if (!currentTarget.contains(document.activeElement)) {
                          // You can invoke a callback or add custom logic here
                          setIsCreatingCollection(false);
                          console.log("coll blur");
                        }
                      }, 0);
                    }}
                    type="text"
                    className=" collection-name"
                    name="collection-create"
                    onChange={(e) => setCollectionName(e.target.value)}
                  ></input>
                ) : (
                  <div className="collection-name">
                    <button
                      className="newNote-btn"
                      onClick={(e) => setIsCreatingCollection(true)}
                    >
                      Add Notebook
                    </button>
                  </div>
                )}
              </div>
              <div className="user-notes">
                <div className="user-notes-topbar">
                  <button
                    className="newNote-btn"
                    onClick={(e) => {
                      if (activeNote) {
                        resetActiveNote();
                      }
                    }}
                  >
                    New Note
                  </button>
                </div>
                <UserNotes />
              </div>
            </div>
          </div>
          <CreateNote />
        </div>
      </div>
    </>
  );
}
