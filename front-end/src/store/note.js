import { csrfFetch } from "./csrf";

const LOAD = "notes/LOAD";
const CREATE = "notes/CREATE";
const REMOVE = "notes/REMOVE";
const EDIT = "notes/EDIT";
const SET_ACTIVE = "notes/SET_ACTIVE";
const load = (notes) => ({
  type: LOAD,
  notes,
});
const create = (noteObj) => ({
  type: CREATE,
  noteObj,
});
const remove = (noteObj) => ({
  type: REMOVE,
  noteObj,
});
const setActive = (noteObj) => ({
  type: SET_ACTIVE,
  noteObj,
});

export const setActiveNote = (noteObj) => async (dispatch) => {
  await dispatch(setActive(noteObj));
};

let isNewSave = false;
export const createNote = (noteObj) => async (dispatch) => {
  if (noteObj && !isNewSave) {
    if (noteObj.id == undefined) isNewSave = true;
    const res = await csrfFetch("/api/notes", {
      method: "POST",
      body: JSON.stringify(noteObj),
    });
    if (res.ok) {
      const data = await res.json();
      await dispatch(create(data));
      if (!noteObj.id) {
        await dispatch(setActive(data));
        isNewSave = false;
      }
    }
  }
};

export const loadNotes = () => async (dispatch) => {
  const res = await csrfFetch("/api/notes", { method: "GET" });
  if (res.ok) {
    const data = await res.json();
    const normalized = {};
    for (let note of data) {
      Object.assign(normalized, { [note.id]: note });
    }
    dispatch(load(normalized));
    return res;
  } else {
  }
};
export const deleteNote = (note) => async (dispatch) => {
  if (
    window.confirm(
      `Are you sure you'd like to permanently delete your note titled "${note.title}"?`
    )
  ) {
    const res = await csrfFetch(`/api/notes/${note.id}`, {
      method: "DELETE",
    });
    dispatch(remove(note));
  } else return;
};
const initialState = { notes: {}, activeNote: null };
export const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      const newState = { notes: action.notes };
      return newState;
    }
    case CREATE: {
      const newState = { ...state };
      newState.notes = {
        ...newState.notes,
        [action.noteObj.id]: action.noteObj,
      };
      return { ...newState };
    }
    case REMOVE: {
      const newState = { ...state };
      if (action.noteObj.id == newState.activeNote?.id)
        delete newState.activeNote;
      delete newState.notes[action.noteObj.id];

      return { notes: { ...newState.notes } };
    }
    case SET_ACTIVE: {
      const newState = { ...state, activeNote: action.noteObj };
      return newState;
    }
    default: {
      return state;
    }
  }
};
