import { csrfFetch } from "./csrf";

const LOAD = "collections/LOAD";
const CREATE = "collections/CREATE";
const REMOVE = "collections/REMOVE";
const EDIT = "collections/EDIT";
const SET_ACTIVE = "collections/SET_ACTIVE";
const load = (collections) => ({
  type: LOAD,
  collections,
});
const create = (collectionObj) => ({
  type: CREATE,
  collectionObj,
});
const remove = (collectionObj) => ({
  type: REMOVE,
  collectionObj,
});
const setActive = (collectionObj) => ({
  type: SET_ACTIVE,
  collectionObj,
});

export const setActiveCollection = (collectionObj) => async (dispatch) => {
  dispatch(setActive(collectionObj));
};

let isNewSave = false;
export const createCollection = (collectionObj) => async (dispatch) => {
  // console.log(collectionObj);
  if (collectionObj && !isNewSave) {
    if (!collectionObj.id) isNewSave = true;
    const res = await csrfFetch("/api/collections", {
      method: "POST",
      body: JSON.stringify(collectionObj),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(create(data));
      if (!collectionObj.id) dispatch(setActive(data));
    }
    isNewSave = false;
  }
};

export const loadCollections = () => async (dispatch) => {
  const res = await csrfFetch("/api/collections", { method: "GET" });
  if (res.ok) {
    const data = await res.json();
    const normalized = {};
    for (let collection of data) {
      Object.assign(normalized, { [collection.id]: collection });
    }
    dispatch(load(normalized));
    return res;
  } else {
  }
};
export const deleteCollection = (collection) => async (dispatch) => {
  if (window.confirm(`Delete notebook named "${collection.name}"?`)) {
    const res = await csrfFetch(`/api/collections/${collection.id}`, {
      method: "DELETE",
    });
    dispatch(remove(collection));
  } else return;
};
const initialState = { collections: {}, activeCollection: { all: true } };
export const collectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      const newState = {
        collections: action.collections,
        activeCollection: { all: true },
      };
      return newState;
    }
    case CREATE: {
      const newState = { ...state };
      newState.collections = {
        ...newState.collections,
        [action.collectionObj.id]: action.collectionObj,
      };
      return { ...newState };
    }
    case REMOVE: {
      const newState = { ...state };
      if (action.collectionObj.id == newState.activeCollection?.id)
        delete newState.activeCollection;
      delete newState.collections[action.collectionObj.id];

      return { collections: { ...newState.collections } };
    }
    case SET_ACTIVE: {
      const newState = {
        ...state,
        activeCollection: action.collectionObj,
      };
      return newState;
    }
    default: {
      return state;
    }
  }
};
