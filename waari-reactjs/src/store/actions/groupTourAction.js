import { CT_PACKAGE_FINALIZED_SUCCESS, FOLLOWUP_CALL_COUNT_SUCCESS, GROUP_NAME_SUCCESS, GROUP_TOUR_COMPLETION_COUNT_SUCCESS, GT_ADVANCE_PAY_SUCCESS, GT_FAMILY_HEAD_DATA_STATUS_SUCCESS } from "./actionTypes";

export const updateFollowUpCallCount = (callCount) => ({
    type: FOLLOWUP_CALL_COUNT_SUCCESS,
    payload: callCount,
});
  
export const updateGroupNameGT = (groupName) => ({
  type: GROUP_NAME_SUCCESS,
  payload: groupName,
});

export const updateGroupTourCompletionStatus = (count) => ({
  type: GROUP_TOUR_COMPLETION_COUNT_SUCCESS,
  payload: count,
});

export const updateFamilyHeadDataCompletionStatus = (completeFlag) => ({
  type: GT_FAMILY_HEAD_DATA_STATUS_SUCCESS,
  payload: completeFlag,
});

export const updateAdvancePaymentStatus = (paymentDoneFlag) => ({
  type: GT_ADVANCE_PAY_SUCCESS,
  payload: paymentDoneFlag,
});

export const updateIsPackageFinalized = (packageFinalizedFlag) => ({
  type: CT_PACKAGE_FINALIZED_SUCCESS,
  payload: packageFinalizedFlag,
});