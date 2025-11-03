import React, { useEffect, useState, useSyncExternalStore } from "react";
import { Tab, Nav } from "react-bootstrap";
import Journey from "./journeyct";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	updateAdvancePaymentStatus,
	updateFamilyHeadDataCompletionStatus,
	updateFollowUpCallCount,
	updateGroupNameGT,
	updateGroupTourCompletionStatus,
	updateIsPackageFinalized,
} from "../../../../../store/actions/groupTourAction";
import { get } from "../../../../../services/apiServices";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";

const OperationManagement = () => {
	const { id } = useParams();
	const {
		groupName,
	} = useSelector((state) => state.groupTour);
	const { permissions } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const tabs = [

		{
			path: "journey",
			label: "Package Upload",
			requiredId: 365,
			tabClickAllowed: true,
		},
		
	
	];
	const [URLSearchParams, setURLSearchParams] = useSearchParams();

	// const [activeTab, setActiveTab] = useState(tabs[0].path);
	const [activeTab, setActiveTab] = useState(tabs[0].path);

	// Parse active tab from query string (if present)
	useEffect(() => {
		const tabFromURL = URLSearchParams.get("activeTab");

		if (tabFromURL && tabs.some((tab) => tab.path === tabFromURL)) {
			setActiveTab(tabFromURL);
		} else {
			setURLSearchParams({ activeTab: tabs[0].path });
		}
	}, [URLSearchParams, setURLSearchParams, tabs]);

	const getFollowupCallCounts = async () => {
		try {
			const response = await get(`/total-call-count-ct?enquiryCustomId=${id}`);

			// set data for all fields
			const count = response.data.callCount;
			dispatch(updateFollowUpCallCount(count));
			dispatch(updateGroupNameGT(response.data.groupName));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getFollowupCallCounts();
	}, []);

	const getCompletionStatusCount = async () => {
		try {
			const response = await get(
				`/custom-tour-completion-status?enquiryCustomId=${id}`
			);

			const count = response.data?.completionStatusCount;
			dispatch(updateGroupTourCompletionStatus(count));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getCompletionStatusCount();
	}, []);

	const getFamilyHeadDataCompletionStatusFlag = async () => {
		try {
			const response = await get(
				`/get-enquiry-status-ct?enquiryCustomId=${id}`
			);

			const familyHeadDataFilled = response.data?.isFamilyHeadData;
			const isPaymentDone = response.data?.isPaymentDone;
			const isPackageFinalized = response.data?.isPackageConfirm;
			dispatch(updateFamilyHeadDataCompletionStatus(familyHeadDataFilled));
			dispatch(updateAdvancePaymentStatus(isPaymentDone));
			dispatch(updateIsPackageFinalized(isPackageFinalized));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getFamilyHeadDataCompletionStatusFlag();
	}, []);

	useEffect(() => {
		// While view farmer page is active, the yadi tab must also activated
		const pathArray = window.location.href.split("/");
		const path = pathArray[pathArray.length - 1];
		let element = document.getElementById("operation-management");
		if (element) {
			element.classList.add("mm-active1"); // Add the 'active' class to the element
		}
		return () => {
			if (element) {
				element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
			}
		};
	}, []);
	return (
		<>
		
			<div className="card">
				<div className="card-body">
					<div className="row">
						<div className="group-name col-md-10">
							<h2>{groupName}</h2>
						</div>
					
					</div>
				</div>
			</div>
			<Tab.Container defaultActiveKey="All">
				<div className="card">
					<div className="card-body">
						<div className="row">
							<div className="col-md-12">
								<div className="d-flex justify-content-between align-items-center flex-wrap">
									<div className="card-action enquiry-tabs">
										<Nav as="ul" className="nav nav-tabs">

											{tabs.map((item) => (
												<>
													{hasComponentPermission(
														permissions,
														item.requiredId
													) && (
														<Nav.Item
															as="li"
															className={`nav-item cursor-pointer`}
															onClick={() => {
																if (item.tabClickAllowed)
																	setURLSearchParams({ activeTab: item.path });
																// setActiveTab(item.path);
															}}
														>
															<div
																style={
																	!item.tabClickAllowed
																		? { backgroundColor: "#f3f3f3" }
																		: null
																}
																className={`nav-link  ${
																	activeTab === item.path ? "active" : ""
																}`}
															>
																{item.label}
															</div>
														</Nav.Item>
													)}
												</>
											))}
										</Nav>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div>
	
					{activeTab === "journey" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Journey enquiryId={id} />
							</div>
						</div>
					)}
				
				</div>
			</Tab.Container>
		</>
	);
};
export default OperationManagement;
