import {
	LOGIN_SUCCESS,
	LOGOUT_SUCCESS,
	SET_PERMISSIONS,
} from "../actions/actionTypes";

// authReducer.js
const initialState = {
	userId: localStorage.getItem("userId") || null,
	roleId: localStorage.getItem("roleId") || null,
	token: localStorage.getItem("token") || null,
	permissions: JSON.parse(localStorage.getItem("permissions")) || [],
};

const authReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case LOGIN_SUCCESS:
			localStorage.setItem("token", payload.token);
			localStorage.setItem("permissions", JSON.stringify(payload.permissions));
			localStorage.setItem("roleId", JSON.stringify(payload.roleId));
			localStorage.setItem("userId", JSON.stringify(payload.userId));

			return {
				...state,
				token: payload.token,
				permissions: payload.permissions,
				roleId: payload.roleId,
				userId: payload.userId,
			};

		case "LOGOUT":
			localStorage.removeItem("token");
			localStorage.removeItem("permissions");
			localStorage.removeItem("roleId");
			localStorage.removeItem("userId");

			return {
				...state,
				token: null,
				permissions: null,
			};

    case SET_PERMISSIONS:
			localStorage.setItem("permissions", JSON.stringify(payload.permissions));

			return {
				...state,
				permissions: payload.permissions,
			};

		default:
			return state;
	}
};

export default authReducer;
