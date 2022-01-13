import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { loadNotes, setActiveNote } from "../../store/note";
import UserNotes from "./UserNotes";
import CreateNote from "./CreateNote";

import "./app.css";
import {
  createCollection,
  deleteCollection,
  loadCollections,
  setActiveCollection,
} from "../../store/collection";
export default function ApplicationPage() {
  const sessionUser = useSelector((state) => state.session.user);
  let collections = useSelector((state) => state.collections.collections) || {};
  const activeNote = useSelector((state) => state.notes.activeNote);
  const activeCollection = useSelector(
    (state) => state.collections.activeCollection
  );
  const [collectionId, setCollectionId] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState([]);
  // console.log(errors);

  const history = useHistory();
  const dispatch = useDispatch();
  // console.log(sessionUser);
  useEffect(() => {
    if (sessionUser) {
      dispatch(loadNotes());
      dispatch(loadCollections());
    }
  }, [sessionUser]);
  // const notes = useSelector((state) => state.notes.notes);
  // const activeNote = useSelector((state) => state.notes.activeNote);
  // console.log(activeCollection);
  // console.log(collections);
  // console.log(collectionId);
  const resetActiveNote = () => {
    dispatch(setActiveNote(null));
  };

  const resetActiveCollection = () => {
    dispatch(setActiveCollection(null));
    setCollectionId(null);
  };
  const filteredCollections = {};
  if (searchTerm) {
    Object.values(collections).map((coll, idx) => {
      if (coll.name.toLowerCase().includes(searchTerm.toLowerCase()))
        Object.assign(filteredCollections, { [coll.id]: coll });
    });
    if (activeCollection != null && !activeCollection.all) {
      Object.assign(filteredCollections, {
        [activeCollection.id]: activeCollection,
      });
    }
  }
  useEffect(() => {
    setCollectionName(activeCollection?.name || "");
    if (activeCollection && isCreatingCollection) {
      // setTimeout(() => {
      // }, 0);
      // if (activeNote?.collectionId != activeCollection?.id) resetActiveNote(); //TODO PLS FIX
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
    }
    //  else {
    //   resetActiveCollection();
    // }
  }, [activeCollection]);
  useEffect(() => {
    const valErrors = [];
    if (!collectionName.length) {
      valErrors.push("Name is too short!");
    }
    if (collectionName.length > 20) {
      valErrors.push("Name is too long!");
    }
    if (valErrors.length == 0) {
      const collectionObj = {
        id: activeCollection?.id,
        userid: sessionUser.id,
        name: collectionName,
      };
      dispatch(createCollection(collectionObj));
    }
    setErrors(valErrors);
  }, [collectionName]);

  if (!sessionUser) {
    history.push("/");
    return <></>;
  }
  return (
    <>
      <div className="application-frame">
        <div className="application-container">
          <div>
            <h1 className="application-title threedee">
              Welcome back, {sessionUser.username}!
            </h1>
            <div className="flex">
              <div className="collections-col threedee">
                <div className="user-notes-topbar">
                  <button
                    className="newNote-btn util-btn"
                    onClick={(e) => {
                      const collectionObj = {
                        id: null,
                        userid: sessionUser.id,
                        name: "New Notebook",
                      };
                      dispatch(createCollection(collectionObj));
                      // resetActiveCollection();
                      // setIsCreatingCollection(true);
                    }}
                  >
                    New Notebook
                  </button>
                </div>

                <input
                  placeholder="Search Notebooks"
                  minLength={1}
                  maxLength={20}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="notebook-searchbar"
                ></input>

                <div
                  className={`flex-v-center collection-name ${
                    activeCollection?.all ? "selected" : ""
                  }`}
                  onClick={(e) => dispatch(setActiveCollection({ all: true }))}
                >
                  All Notes
                </div>
                {Object.values(
                  Object.keys(filteredCollections).length === 0
                    ? collections
                    : filteredCollections
                ).map((coll) =>
                  isCreatingCollection && activeCollection?.id == coll.id ? (
                    <div key={coll.id} className="collection-name">
                      {errors.length > 0 && (
                        <>
                          {/* <span className="error-item">SAVE PREVENTED</span> */}
                          <ul>
                            {errors.map((err) => {
                              return (
                                <li className="error-item problem" key={err}>
                                  {err}
                                </li>
                              );
                            })}
                          </ul>
                        </>
                      )}
                      <input
                        autoFocus={true}
                        minLength={1}
                        maxLength={20}
                        defaultValue={coll.name}
                        onBlur={(e) => {
                          const currentTarget = e.currentTarget;
                          setTimeout(() => {
                            // Check if the new activeElement is a child of the original container
                            if (
                              !currentTarget.contains(document.activeElement)
                            ) {
                              // You can invoke a callback or add custom logic here
                              setIsCreatingCollection(false);
                            }
                          }, 0);
                        }}
                        type="text"
                        name="collection-create"
                        className="editing-col-name"
                        onChange={(e) => setCollectionName(e.target.value)}
                      ></input>
                    </div>
                  ) : (
                    <div
                      className={`collection-name ${
                        coll.id == activeCollection?.id ? "selected" : ""
                      }`}
                      key={coll.id}
                      onClick={(e) => {
                        setEditing(false);
                        dispatch(setActiveCollection(coll));
                      }}
                    >
                      <div className="flex-v-center">{coll.name}</div>
                      {activeCollection?.id == coll.id && (
                        <div className="flex-align-bottom ">
                          <button
                            className="edit-Notebook-btn util-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsCreatingCollection(true);
                            }}
                          >
                            Rename
                          </button>
                          <span className="middle-line" />
                          <button
                            className="edit-Notebook-btn util-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(deleteCollection(coll));
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
              <div className="user-notes threedee">
                <div className="user-notes-topbar">
                  <button
                    className="newNote-btn util-btn"
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
          <CreateNote
            setActiveCollection={setActiveCollection}
            collections={collections || null}
            isEditing={isEditing}
            setEditing={setEditing}
          />
        </div>
      </div>
    </>
  );
}
