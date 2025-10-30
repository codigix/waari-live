import {
	CT_PACKAGE_FINALIZED_SUCCESS,
	FOLLOWUP_CALL_COUNT_SUCCESS,
	GROUP_NAME_SUCCESS,
	GROUP_TOUR_COMPLETION_COUNT_SUCCESS,
	GT_ADVANCE_PAY_SUCCESS,
	GT_FAMILY_HEAD_DATA_STATUS_SUCCESS,
} from "../actions/actionTypes";

// GroupTourReducer.js
const initialState = {
	callCount: 100,
	groupName: "",
	groupTourCompletionStatusCount: 1,
	isPackageConfirm: false,
	isFamilyHeadDataFilled: false,
	isPaymentDone: false,
};

const GroupTourReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case FOLLOWUP_CALL_COUNT_SUCCESS:
			return {
				...state,
				callCount: payload,
			};
		case GROUP_NAME_SUCCESS:
			return {
				...state,
				groupName: payload,
			};
		case GROUP_TOUR_COMPLETION_COUNT_SUCCESS:
			return {
				...state,
				groupTourCompletionStatusCount: payload,
			};
		case GT_FAMILY_HEAD_DATA_STATUS_SUCCESS:
			return {
				...state,
				isFamilyHeadDataFilled: payload,
			};
		case GT_ADVANCE_PAY_SUCCESS:
			return {
				...state,
				isPaymentDone: payload,
			};
		case CT_PACKAGE_FINALIZED_SUCCESS:
			return {
				...state,
				isPackageConfirm: payload,
			};
		default:
			return state;
	}
};

export default GroupTourReducer;
