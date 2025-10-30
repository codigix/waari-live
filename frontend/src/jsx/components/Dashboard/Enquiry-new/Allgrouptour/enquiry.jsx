import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Enquirydetails from "./enquirydetail";
import Followup from "./followup";
import Journey from "./journeys";
import Booking from "./booking";
import Confirmpayment from "./confirmpayment";
import Document from "./document";
import NavigationItem from "../../common/NavigationItem";
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	updateFamilyHeadDataCompletionStatus,
	updateFollowUpCallCount,
	updateGroupNameGT,
	updateGroupTourCompletionStatus,
} from "../../../../../store/actions/groupTourAction";
import { get } from "../../../../../services/apiServices";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import BackButton from "../../../common/BackButton";

const Enquiry = () => {
	const { id } = useParams();
	const { callCount, groupName, groupTourCompletionStatusCount, isFamilyHeadDataFilled, isPaymentDone } = useSelector(
		(state) => state.groupTour
	);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const tabs = [
		{ path: "enquiryDetails", label: "Enquiry Details", requireId: 205, tabClickAllowed: true },
		{ path: "followup", label: "Follow-up/Call log", requireId: 204, tabClickAllowed: true },
		{ path: "journey", label: "Journeys", requireId: 206, tabClickAllowed: true },
		{ path: "booking", label: "Booking Forms", requireId: 207, tabClickAllowed: isFamilyHeadDataFilled },
		{ path: "payment", label: "Payment Details", requireId: 208, tabClickAllowed: isFamilyHeadDataFilled && isPaymentDone },
		{ path: "document", label: "Documents", requireId: 210, tabClickAllowed: isFamilyHeadDataFilled },
		// { path: "canceltour", label: "Cancel Tour" },
	];
	const [URLSearchParams, setURLSearchParams] = useSearchParams();

	// const [activeTab, setActiveTab] = useState(tabs[0].path);
	const [activeTab, setActiveTab] = useState(tabs[0].path);
	const {permissions} = useSelector(state => state.auth)

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
		let element = document.getElementById("all-group-tour-new");
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
			const response = await get(`/total-call-count-gt?enquiryGroupId=${id}`);

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
				`/group-tour-completion-status?enquiryGroupId=${id}`
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
				`/get-enquiry-status-gt?enquiryGroupId=${id}`
			);

			const familyHeadDataFilled = response.data?.isFamilyHeadData;
			const isPaymentDone = response.data?.isPaymentDone;
			dispatch(updateFamilyHeadDataCompletionStatus(familyHeadDataFilled));
			dispatch(updateAdvancePaymentStatus(isPaymentDone));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getFamilyHeadDataCompletionStatusFlag();
	}, []);

	return (
		<>
			<div className="card"  style={{ marginBottom: '40px' }}>
				<div className="row page-titles mx-0 fixed-top-breadcrumb">
					   <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
						<li className="breadcrumb-item active">
							<Link to="/dashboard">Dashboard</Link>
						</li>
						<li className="breadcrumb-item">
							<Link to="/group-tour-new">Enquiry follow-up</Link>
						</li>
						<li className="breadcrumb-item  ">
							<Link
								to={() =>
									navigate(
										`/enquiry/${item.enquiryGroupId}?${activeTab === item.path}`
									)
								}
							>
								Enquiry
							</Link>
						</li>
					</ol>
				</div>
			</div>
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
											{tabs.map((item, index) => (
												<React.Fragment key={item.path}>
													{hasComponentPermission(
														permissions,
														item.requireId
													) && (
														<Nav.Item
															as="li"
															className={`nav-item cursor-pointer`}
															
															onClick={() => {
																if (item.tabClickAllowed) setURLSearchParams({ activeTab: item.path });
																// setActiveTab(item.path);
															}}
														>
															<div
																style={ !item.tabClickAllowed ? {backgroundColor: "#f3f3f3"} : null}
																className={`nav-link  ${
																	activeTab === item.path ? "active" : ""
																}`}
															>
																{item.label}
															</div>
														</Nav.Item>
													)}
												</React.Fragment>
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
								<Enquirydetails enquiryId={id} />
							</div>
						</div>
					)}

					{activeTab == "followup" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Followup enquiryId={id} />
							</div>
						</div>
					)}

					{activeTab === "journey" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Journey enquiryId={id} />
							</div>
						</div>
					)}
					{activeTab == "booking" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Booking enquiryId={id} />
							</div>
						</div>
					)}
					{activeTab === "payment" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Confirmpayment enquiryId={id} />
							</div>
						</div>
					)}
					{activeTab === "document" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Document enquiryId={id} />
							</div>
						</div>
					)}
					{/* {activeTab === "canceltour" && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Canceltour enquiryId={id} />
							</div>
						</div>
					)} */}
				</div>
			</Tab.Container>
		</>
	);
};
export default Enquiry;
