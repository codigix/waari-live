import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Enquirydetails from "./enquirydetail";
import Followup from "./followup";
import Journey from "./journeys";
import Booking from "./booking";
import Confirmpayment from "./confirmpayment";
import Document from "./document";
import Canceltour from "./canceltour";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	updateFollowUpCallCount,
	updateGroupNameGT,
	updateGroupTourCompletionStatus,
} from "../../../../../store/actions/groupTourAction";
import { get } from "../../../../../services/apiServices";
import NavigationItem from "../../common/NavigationItem";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";

const Enquiry = () => {
	const { enquiryId, familyHeadGtId } = useParams();
	const { permissions } = useSelector((state) => state.auth);

	const { callCount, groupName, groupTourCompletionStatusCount } = useSelector(
		(state) => state.groupTour
	);
	const dispatch = useDispatch();

	const tabs = [
		{ path: "enquiryDetails", label: "Enquiry Details", requiredId: 225 },
		{ path: "followup", label: "Follow-up/Call log", requiredId: 226 },
		{ path: "journey", label: "Journeys", requiredId: 227 },
		{ path: "booking", label: "Booking Forms", requiredId: 228 },
		{ path: "payment", label: "Payment Details", requiredId: 229 },
		{ path: "document", label: "Documents", requiredId: 231 },
		{ path: "canceltour", label: "Cancel Tour", requiredId: 234 },
	];
	const [URLSearchParams, setURLSearchParams] = useSearchParams();
	// const [activeTab, setActiveTab] = useState(tabs[0].path);
	const [activeTab, setActiveTab] = useState(tabs[0].path);

	const assignto = [
		{ value: "1", label: "Bhushan" },
		{ value: "2", label: "Sohan" },
		{ value: "3", label: "Raj" },
	];
	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: "34px", // Adjust the height to your preference
		}),
	};

	// Parse active tab from query string (if present)
	useEffect(() => {
		const tabFromURL = URLSearchParams.get("activeTab");
		const tab2FromURL = URLSearchParams.get("familyHeadTab");

		if (tabFromURL && tabs.some((tab) => tab.path === tabFromURL)) {
			setActiveTab(tabFromURL);
		} else {
			setURLSearchParams({ activeTab: tabs[0].path });
		}
	}, [URLSearchParams, setURLSearchParams, tabs]);

	useEffect(() => {
		// While view farmer page is active, the yadi tab must also activated
		// console.log(window.location.href.split("/"));
		const pathArray = window.location.href.split("/");
		const path = pathArray[pathArray.length - 1];
		// console.log(path);
		let element = document.getElementById("all-booking-group-tour-new");
		// console.log(element);
		if (element) {
			element.classList.add("mm-active1"); // Add the 'active' class to the element
		}

		return () => {
			if (element) {
				element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
			}
		};
	}, []);

	const getFollowupCallCounts = async () => {
		try {
			const response = await get(
				`/total-call-count-gt?enquiryGroupId=${enquiryId}`
			);

			// set data for all fields
			const count = response.data.callCount;
			const groupName = response.data.groupName;

			dispatch(updateFollowUpCallCount(count));
			dispatch(updateGroupNameGT(groupName));
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
				`/group-tour-completion-status?enquiryGroupId=${enquiryId}&familyHeadGtId=${familyHeadGtId}`
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

	return (
		<>
			<div className="card">
				<div className="card-body">
					<div
						className="nav nav-tabs role-tab"
						style={{ display: "block", borderBottom: "0" }}
					>
						<div className="row">
							<NavigationItem
								completionStatus={groupTourCompletionStatusCount}
								stepNumber={1}
								stepName="New Enquiry"
							/>
							<NavigationItem
								completionStatus={groupTourCompletionStatusCount}
								stepNumber={2}
								stepName="Follow-up"
							/>
							<NavigationItem
								completionStatus={groupTourCompletionStatusCount}
								stepNumber={3}
								stepName="Confirmation"
							/>
							<NavigationItem
								completionStatus={groupTourCompletionStatusCount}
								stepNumber={4}
								stepName="Payment"
							/>
							<NavigationItem
								completionStatus={groupTourCompletionStatusCount}
								stepNumber={5}
								stepName="Invoice"
							/>
							<NavigationItem
								completionStatus={groupTourCompletionStatusCount}
								stepNumber={6}
								stepName="Bookings"
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="card">
				<div className="card-body">
					<div className="row">
						<div className="group-name col-md-10">
							<h2>{groupName}</h2>
							<h4>Total Calls : {callCount}</h4>
						</div>
						{/* <div className="assign-name col-md-2 m-auto ">
							<div
								className=" d-flex justify-content-end"
								style={{ flexDirection: "column" }}
							>
								<label className="form-label">Assign To</label>
								<Select
									styles={customStyles}
									className="basic-single"
									classNamePrefix="select"
									name="paymentmode"
									options={assignto}
								/>
							</div>
						</div> */}
					</div>
				</div>
			</div>
			<Tab.Container defaultActiveKey={activeTab}>
				<div className="card">
					<div className="card-body">
						<div className="row">
							<div className="col-md-12">
								<div className="d-flex justify-content-between align-items-center flex-wrap">
									<div className="card-action enquiry-tabs">
										<Nav as="ul" className="nav nav-tabs">
											{/* <Nav.Item as="li" className="nav-item" onClick={() => handleTabChange('enquiryDetails')}>
                        <Nav.Link className="nav-link d-flexs" eventKey={"enquiryDetails"} >
                          <svg width="1rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ padding: "1px 2px" }}><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg> Enquiry Details
                        </Nav.Link>
                      </Nav.Item> */}
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
																setURLSearchParams({ activeTab: item.path });
																// setActiveTab(item.path);
															}}
														>
															<div
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
					{activeTab == "enquiryDetails" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Enquirydetails
									enquiryId={enquiryId}
									familyHeadGtId={familyHeadGtId}
								/>
							</div>
						</div>
					)}

					{activeTab == "followup" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Followup
									enquiryId={enquiryId}
									familyHeadGtId={familyHeadGtId}
								/>
							</div>
						</div>
					)}

					{activeTab === "journey" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Journey
									enquiryId={enquiryId}
									familyHeadGtId={familyHeadGtId}
								/>
							</div>
						</div>
					)}
					{activeTab == "booking" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Booking
									enquiryId={enquiryId}
									familyHeadGtId={familyHeadGtId}
								/>
							</div>
						</div>
					)}
					{activeTab === "payment" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Confirmpayment
									enquiryId={enquiryId}
									familyHeadGtId={familyHeadGtId}
								/>
							</div>
						</div>
					)}
					{activeTab === "document" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Document
									enquiryId={enquiryId}
									familyHeadGtId={familyHeadGtId}
								/>
							</div>
						</div>
					)}
					{activeTab === "canceltour" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Canceltour
									enquiryId={enquiryId}
									familyHeadGtId={familyHeadGtId}
								/>
							</div>
						</div>
					)}
				</div>
			</Tab.Container>
		</>
	);
};
export default Enquiry;
