import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import PopupModal from "../../Popups/PopupModal";
import CancelEnquiryModal from "./CancelEnquiryModal";
import { get } from "../../../../../services/apiServices";
import CancelledMembers from "./CancelledMembers";
import { Tab } from "react-bootstrap";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import { useSelector } from "react-redux";

const Canceltourform = ({ familyHead, enquiryId }) => {
	const [cancelMemberDetails, setCancelEnquiryDetails] = useState(null);
	const [cancelEnquiry, setCancelEnquiry] = useState(false);
	const [render, setRender] = useState(false);
	const { permissions } = useSelector((state) => state.auth);

	const handleDialogClose = () => {
		setCancelEnquiry(false);
		setRender(prev => !prev)
	};


	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: "34px", // Adjust the height to your preference
		}),
	};

	const [familyMembersList, setFamilyMembersList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getFamilyMembersList = async () => {
		try {
			setIsLoading(true);
			const response = await get(
				`/guests-list-custom-tour?enquiryCustomId=${enquiryId}&enquiryDetailCustomId=${familyHead.enquiryDetailCustomId}`
			);

			const tranformedFamilyMembersList = response.data?.data?.map(
				(member) => ({
					customGuestDetailsId: member.customGuestDetailsId,
					fullName: member.firstName + " " + member.lastName,
					isCancel: member.isCancel,
					guestId: member.guestId,
				})
			);

			setFamilyMembersList(tranformedFamilyMembersList);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getFamilyMembersList();
	}, [render]);


	const [cancelledMembersList, setCancelledMembersList] = useState([]);
	const [isCancelledMembersLoading, setIsCancelledMembersLoading] =
		useState(false);

	const [cancelledMemberTab, setCancelledMemberTab] = useState(
		cancelledMembersList[0]?.path
	);

	const [renderCancelMemberList, setRenderCancelMemberList] = useState(false);

	const getCancelledMembersList = async () => {
		try {
			setIsCancelledMembersLoading(true);
			const reponse = await get(
				`/get-cancellation-process-data-ct?enquiryCustomId=${enquiryId}&enquiryDetailCustomId=${familyHead.enquiryDetailCustomId}`
			);

			const transformedCancelledMembersList = reponse.data?.data.map(
				(cancelledMember, index) => ({
					path: cancelledMember.name + index,
					label: `Cancellation ${index + 1}`,
					...cancelledMember,
				})
			);

			setCancelledMemberTab(transformedCancelledMembersList[0]?.path);

			setCancelledMembersList(transformedCancelledMembersList);
		} catch (error) {
			console.log(error);
		} finally {
			setIsCancelledMembersLoading(false);
		}
	};

	useEffect(() => {
		getCancelledMembersList();
	}, [renderCancelMemberList]);


	const reRenderCancelledMembersOnProofUpload = () => {
		setRenderCancelMemberList(prev => !prev)
	}
	return (
		<>
			{cancelEnquiry && (
				<PopupModal open={true} onDialogClose={handleDialogClose}>
					<CancelEnquiryModal
						cancelMemberDetails={cancelMemberDetails}
						familyHeadDetails={familyHead}
						enquiryId={enquiryId}
						onClose={handleDialogClose}
						reRenderCancelledMembersOnProofUpload={reRenderCancelledMembersOnProofUpload}
					/>
				</PopupModal>
			)}
			<section>
				<div className="card-header card-header-second p-0">
					<div className="card-title h5">Name</div>
				</div>
				<div className="row">
					<div className="col-md-5">
						{familyMembersList.map((member, index) => (
							<div className="row mb-2">
								<div className="col-md-6 col-sm-6 col-lg-6 col-12">
									<label
										className={`form-label ${
											member.isCancel ? "cancel-tour" : ""
										}`}
									>
										{member.fullName}
									</label>
								</div>
								{(!member.isCancel && hasComponentPermission(permissions, 257)) ? (
									<div className="col-md-6 col-sm-6 col-lg-6 col-12">
										<button
											className="btn btn-back"
											onClick={() => {
												setCancelEnquiry(true);
												setCancelEnquiryDetails(member);
											}}
										>
											Cancel Tour
										</button>
									</div>
								) : (
									""
								)}
							</div>
						))}
					</div>
				</div>
				<div className="divider"></div>
				<Tab.Container defaultActiveKey={cancelledMemberTab}>
					<div className="row">
						<div className="col-md-12">
							<div className="d-flex justify-content-between align-items-center flex-wrap">
								<div className="card-action customer-tabs">
									<div className="nav nav-tabs">
										{cancelledMembersList.length > 0 &&
											cancelledMembersList.map((item) => (
												<div
													key={item.enquiryDetailCustomId}
													className={`nav-item cursor-pointer`}
													onClick={() => {
														// setURLSearchParams({ familyHeadTab: item.path });
														setCancelledMemberTab(item.path);
													}}
												>
													<div
														className={`nav-link  ${
															cancelledMemberTab === item.path ? "active" : ""
														}`}
													>
														{item.label}
													</div>
												</div>
											))}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="tab-content-done">
						<div>
							{cancelledMembersList.length > 0 &&
								cancelledMembersList.map((cancelledMember, index) => (
									<div className="row" key={cancelledMember.name + index}>
										<div className="col-xl-12 col-xxl-12">
											{/* Render Bookingformnew with conditional rendering based on selected family head */}
											{cancelledMemberTab == cancelledMember.path && (
												<CancelledMembers
													cancelledMember={cancelledMember}
													enquiryId={enquiryId}
													enquiryDetailCustomId={familyHead.enquiryDetailCustomId}
													reRenderCancelledMembersOnProofUpload={reRenderCancelledMembersOnProofUpload}
												/>
											)}
										</div>
									</div>
								))}
						</div>
					</div>
				</Tab.Container>
			</section>
		</>
	);
};
export default Canceltourform;
