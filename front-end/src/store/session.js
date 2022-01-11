import { useHistory } from "react-router-dom";

const { csrfFetch } = require("./csrf");

const LOGIN = "users/LOGIN";
const LOGOUT = "users/LOGOUT";

const SET_THEME = "users/SET_THEME";
const SET_DARK = "user/SET_DARK";
const login = (user) => ({
  type: LOGIN,
  user,
});
const logout = () => ({
  type: LOGOUT,
});

const setTheme = (num) => ({
  type: SET_THEME,
  num,
});

const setDark = (dark) => ({
  type: SET_DARK,
  dark,
});

export const setUserTheme = (num) => async (dispatch) => {
  dispatch(setTheme(num));
};

export const setUserDark = (isDark) => async (dispatch) => {
  dispatch(setDark(isDark));
};

export const loginDemo = () => async (dispatch) => {
  const res = await csrfFetch("/api/session/demo", {
    method: "GET",
  });
  if (res.ok) {
    const data = await res.json();
    const user = data.user;
    dispatch(login(user));
  } else {
  }
};

export const loginUser =
  ({ username, password }) =>
  async (dispatch) => {
    const res = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const user = data.user;
      dispatch(login(user));
    } else {
    }
  };

export const logoutUser = () => async (dispatch) => {
  const res = await csrfFetch("/api/session", { method: "DELETE" });
  if (res.ok) {
    dispatch(logout());
    // window.location.reload(true);
    return res;
  } else {
  }
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(login(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(login(data.user));
  return response;
};

const initialState = { user: null, theme: 0 };
export const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      const newState = { ...state };
      newState.user = action.user;
      return newState;
    }
    case LOGOUT: {
      return { ...initialState };
    }
    case SET_THEME: {
      const newState = { ...state };
      newState.theme = action.num;
      return newState;
    }
    case SET_DARK: {
      const newState = { ...state };
      newState.dark = action.dark;
      return newState;
    }
    default: {
      return state;
    }
  }
};
