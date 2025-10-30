import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import PaymentformCT from "./paymentformct";
import { get } from "../../../../../services/apiServices";

const ConfirmPaymentCT = ({ enquiryId }) => {
	const [familyHeadsList, setFamilyHeadsList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [familyHeadTab, setFamilyHeadTab] = useState(familyHeadsList[0]?.path);
	const [enquiryDetailCustomId, setEnquiryenquiryDetailCustomId] = useState(
		familyHeadsList[0]?.enquiryDetailCustomId
	);

	const [grandTotal, setGrandTotal] = useState("");
	const [advancePayment, setAdvancePayment] = useState("");
	const [balance, setBalance] = useState("");

	const [reRender, setReRender] = useState(false);

	const handleRerender = () => {
		setReRender(!reRender);
	};

	const getFamilyHeadsList = async () => {
		try {
			setIsLoading(true);
			const reponse = await get(
				`/familyHead-list-ct?enquiryCustomId=${enquiryId}`
			);

			const transformedFamilyHeadsList = reponse.data?.data.map((fHead) => ({
				enquiryDetailCustomId: fHead.enquiryDetailCustomId,
				familyHeadName: fHead.preFixName + fHead.firstName + fHead.lastName,
				path: fHead.firstName + fHead.lastName,
				label: fHead.preFixName + " " + fHead.firstName + " " + fHead.lastName,
			}));

			setFamilyHeadTab(transformedFamilyHeadsList[0].path);
			setEnquiryenquiryDetailCustomId(
				transformedFamilyHeadsList[0].enquiryDetailCustomId
			);

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

	useEffect(() => {
		if (enquiryDetailCustomId) {
			getPaymentDetails(enquiryDetailCustomId);
		}
	}, [reRender, enquiryDetailCustomId]);

	const getPaymentDetails = async (id) => {
		try {
			setIsLoading(true);
			const response = await get(
				`/view-payment-bill-ct?enquiryDetailCustomId=${
					enquiryDetailCustomId ? enquiryDetailCustomId : id
				}&enquiryCustomId=${enquiryId}`
			);

			const data = response.data?.data[0];
			setAdvancePayment(data.advancePayment);
			setGrandTotal(data.grandTotal);
			setBalance(data.balance);
		} catch (error) {
			console.log(error);
			setAdvancePayment("");
			setGrandTotal("");
			setBalance("");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="card">
			<div className="card-body">
				<Tab.Container defaultActiveKey="All">
					<div className="row">
						<div className="col-md-12">
							<div className="d-flex justify-content-between align-items-center flex-wrap">
								<div className="card-action customer-tabs">
									<Nav as="ul" className="nav nav-tabs">
										{familyHeadsList.length > 0 &&
											familyHeadsList.map((item) => (
												<div
													key={item.enquiryDetailCustomId}
													className={`nav-item cursor-pointer`}
													onClick={() => {
														// setURLSearchParams({ familyHeadTab: item.path });
														setFamilyHeadTab(item.path);
														setEnquiryenquiryDetailCustomId(
															item.enquiryDetailCustomId
														);
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
									</Nav>
								</div>
							</div>
						</div>
					</div>
					<div className="tab-content-done">
						{familyHeadsList.length > 0 &&
							familyHeadsList.map((fHead) => (
								<div key={fHead.enquiryDetailCustomId}>
									{/* Render Bookingformnew with conditional rendering based on selected family head */}
									{familyHeadTab == fHead.path && (
										<PaymentformCT
											key={fHead.enquiryDetailCustomId}
											familyHead={fHead}
											enquiryId={enquiryId}
											grandTotal={grandTotal}
											advancePayment={advancePayment}
											balance={balance}
											handleRerender={handleRerender}
										/>
									)}
								</div>
							))}
					</div>
				</Tab.Container>
			</div>
		</div>
	);
};
export default ConfirmPaymentCT;
