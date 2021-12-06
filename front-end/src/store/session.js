const { csrfFetch } = require("./csrf");

const LOGIN = "users/LOGIN";
const LOGOUT = "users/LOGOUT";

const login = (user) => ({
  type: LOGIN,
  user,
});
const logout = () => ({
  type: LOGOUT,
});

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

const initialState = { user: null };
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
    default: {
      return state;
    }
  }
};
