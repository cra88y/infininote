import { csrfFetch } from "./csrf";

const LOAD = "notes/LOAD";
const CREATE = "notes/CREATE";
const REMOVE = "notes/REMOVE";
const EDIT = "notes/EDIT";
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

export const createNote = (noteObj) => async (dispatch) => {
  const res = await csrfFetch("/api/notes", {
    method: "POST",
    body: JSON.stringify(noteObj),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(create(data));
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
  const res = await csrfFetch(`/api/notes/${note.id}`, {
    method: "DELETE",
  });
  dispatch(remove(note));
};
const initialState = { notes: {} };
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
      delete newState.notes[action.noteObj.id];
      return { notes: { ...newState.notes } };
    }
    default: {
      return state;
    }
  }
};
