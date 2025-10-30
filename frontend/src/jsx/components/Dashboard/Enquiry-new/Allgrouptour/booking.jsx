import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Bookingformnew from "./bookingform";
import { get } from "../../../../../services/apiServices";

const Booking = ({ enquiryId }) => {
	const [familyHeadsList, setFamilyHeadsList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [familyHeadTab, setFamilyHeadTab] = useState(familyHeadsList[0]?.path);


	const getFamilyHeadsList = async () => {
		try {
			setIsLoading(true);
			const reponse = await get(
				`/familyHead-list-gt?enquiryGroupId=${enquiryId}`
			);

			const transformedFamilyHeadsList = reponse.data?.data.map((fHead, index) => ({
				familyHeadGtId: fHead.familyHeadGtId,
				preFixId: fHead.preFixId,
                preFixName: fHead.preFixName,
                firstName: fHead.firstName,
                lastName: fHead.lastName,
				familyHeadName: fHead.preFixName + fHead.firstName + fHead.lastName,
				guestId: fHead.guestId,
				paxNo: fHead.paxPerHead,
				path: fHead.firstName + fHead.lastName + index,
				label: fHead.preFixName + " " + fHead.firstName + " " + fHead.lastName,
				destinationId: fHead.destinationId,
				loyaltyPoints: fHead.loyaltyPoints,
				address: fHead.address,
                contact: fHead.contact,
			}));

			setFamilyHeadTab(transformedFamilyHeadsList[0]?.path);

			setFamilyHeadsList(transformedFamilyHeadsList);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getFamilyHeadsList();
	}, []);


	return (
		<>
			<div className="card">
				<div className="card-body">
					<Tab.Container defaultActiveKey={familyHeadTab}>
						<div className="row">
							<div className="col-md-12">
								<div className="d-flex justify-content-between align-items-center flex-wrap">
									<div className="card-action customer-tabs">
										<div className="nav nav-tabs">
											{familyHeadsList.length > 0 &&
												familyHeadsList.map((item) => (
													<div
														key={item.familyHeadGtId}
														className={`nav-item cursor-pointer`}
														onClick={() => {
															// setURLSearchParams({ familyHeadTab: item.path });
															setFamilyHeadTab(item.path);
														}}
													>
														<div
															className={`nav-link  ${
																familyHeadTab === item.path ? "active" : ""
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
								{familyHeadsList.length > 0 &&
									familyHeadsList.map((fHead) => (
										<div className="row" key={fHead.familyHeadGtId}>
											<div className="col-xl-12 col-xxl-12">
												{/* Render Bookingformnew with conditional rendering based on selected family head */}
												{familyHeadTab == fHead.path && (
													<Bookingformnew
														key={fHead.familyHeadGtId}
														familyHead={fHead}
														enquiryId={enquiryId}
													/>
												)}
											</div>
										</div>
									))}
							</div>
						</div>
					</Tab.Container>
				</div>
			</div>
		</>
	);
};
export default Booking;
