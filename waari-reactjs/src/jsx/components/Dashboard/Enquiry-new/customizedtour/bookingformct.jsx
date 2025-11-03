import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Guestdetails from "./guestdetailsct";
import Tourcost from "./tourcostct";
import Payment from "./paymentct";
import Rooming from "./roomingct";

const inititalTabs = [
	{ path: "rooming", label: "Rooming" },
	{ path: "guest", label: "Guest Details" },
	{ path: "tour-cost", label: "Tour Cost" },
	{ path: "payment", label: "Payment" },
];

const BookingformnewCT = ({ familyHead, enquiryId }) => {
	const [subTabsList, setSubTabsList] = useState(inititalTabs);
	const [activeSubTab, setActiveSubTab] = useState(inititalTabs[0]?.path);
	
	const successCallBack = (nextTabPath) => {
		setActiveSubTab(nextTabPath)
	}

	return (
		<>
			<Tab.Container defaultActiveKey={activeSubTab}>
				<div className="row">
					<div className="col-md-12">
						<div className="d-flex justify-content-between align-items-center flex-wrap">
							<div className="card-action booking-tabs mb-2 mt-2">
								<Nav as="ul" className="nav nav-tabs">
									{subTabsList.map((item) => (
										<div
											key={item.path}
											className={`nav-item cursor-pointer`}
											onClick={() => {
												setActiveSubTab(item.path);
											}}
										>
											<div
												className={`nav-link  ${
													activeSubTab === item.path ? "active" : ""
												}`}
											>
												{item.label}
											</div>
										</div>
									))}

								</Nav>
							</div>
						</div>
					</div>
				</div>

				<div>

					{activeSubTab == subTabsList[0].path && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Rooming enquiryId={enquiryId} familyHead={familyHead} callbackOnSuccess={successCallBack} redirectForwandOnSuccess={subTabsList[1].path}  />
							</div>
						</div>
					)}

					{activeSubTab == subTabsList[1].path && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Guestdetails enquiryId={enquiryId} familyHead={familyHead} callbackOnSuccess={successCallBack} redirectForwandOnSuccess={subTabsList[2].path}  />
							</div>
						</div>
					)}

					{activeSubTab == subTabsList[2].path && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Tourcost enquiryId={enquiryId} familyHead={familyHead} callbackOnSuccess={successCallBack} redirectForwandOnSuccess={subTabsList[3].path}  />
							</div>
						</div>
					)}

					{activeSubTab == subTabsList[3].path && (
						<div className="row">
							<div className="col-xl-12 col-xxl-12">
								<Payment enquiryId={enquiryId} familyHead={familyHead}  />
							</div>
						</div>
					)}
				</div>
			</Tab.Container>
		</>
	);
};
export default React.memo(BookingformnewCT);
