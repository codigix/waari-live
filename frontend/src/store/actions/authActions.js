import { LOGIN_SUCCESS, LOGOUT_SUCCESS, SET_PERMISSIONS } from "./actionTypes";

export const login = (token, permissions, roleId, userId) => ({
  type: LOGIN_SUCCESS,
  payload: { token, permissions, roleId, userId },
});

export const logout = () => ({
  type: LOGOUT_SUCCESS,
});


export const setPermissions = (permissions) => ({
  type: SET_PERMISSIONS,
  payload: {permissions},
})