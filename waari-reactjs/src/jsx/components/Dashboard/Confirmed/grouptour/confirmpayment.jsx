import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Paymentform from "./paymentform";
import { get } from "../../../../../services/apiServices";

const confirmpayment = ({ enquiryId, familyHeadGtId }) => {
	const [familyHeadsList, setFamilyHeadsList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [familyHeadTab, setFamilyHeadTab] = useState(familyHeadsList[0]?.path);
	const [selectedFamilyHeadId, setSelectedFamilyHeadId] = useState(
		familyHeadsList[0]?.familyHeadGtId
	);

	const [grandTotal, setGrandTotal] = useState("");
	const [advancePayment, setAdvancePayment] = useState("");
	const [balance, setBalance] = useState("");

	const [reRender, setRerender] = useState(false);

	const handleRerender = () => {
		setRerender(!reRender);
	};

	const getFamilyHeadsList = async () => {
		try {
			setIsLoading(true);
			const reponse = await get(
				`/family-head-data?enquiryGroupId=${enquiryId}&familyHeadGtId=${familyHeadGtId}`
			);

			const transformedFamilyHeadsList = reponse.data?.data.map((fHead) => ({
				familyHeadGtId: fHead.familyHeadGtId,
				familyHeadName: fHead.preFixName + fHead.firstName + fHead.lastName,
				path: fHead.firstName + fHead.lastName,
				label: fHead.preFixName + " " + fHead.firstName + " " + fHead.lastName,
			}));

			setFamilyHeadTab(transformedFamilyHeadsList[0].path);
			setSelectedFamilyHeadId(transformedFamilyHeadsList[0].familyHeadGtId);

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
		if (selectedFamilyHeadId) {
			getPaymentDetails();
		}
	}, [selectedFamilyHeadId, reRender]);

	const getPaymentDetails = async (id) => {
		try {
			setIsLoading(true);
			const response = await get(
				`/view-payment-bill-gt?familyHeadGtId=${
					selectedFamilyHeadId ? selectedFamilyHeadId : familyHeadGtId
				}&enquiryGroupId=${enquiryId}`
			);

			const data = response.data?.data[0];
			setAdvancePayment(data.advancePayment);
			setGrandTotal(data.grandTotal);
			setBalance(data.balance);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="card">
			<div className="card-body">
				<Tab.Container defaultActiveKey="All">
					<div className="d-flex justify-content-between align-items-center flex-wrap">
						<div className="card-action customer-tabs">
							<Nav as="ul" className="nav nav-tabs">
								{familyHeadsList.length > 0 &&
									familyHeadsList.map((item) => (
										<div
											key={item.familyHeadGtId}
											className={`nav-item cursor-pointer`}
											onClick={() => {
												// setURLSearchParams({ familyHeadTab: item.path });
												setFamilyHeadTab(item.path);
												setSelectedFamilyHeadId(item.familyHeadGtId);
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

					<div className="tab-content-done">
						{familyHeadsList.length > 0 &&
							familyHeadsList.map((fHead) => (
								<div key={fHead.familyHeadGtId}>
									{/* Render Bookingformnew with conditional rendering based on selected family head */}
									{familyHeadTab == fHead.path && (
										<Paymentform
											key={fHead.familyHeadGtId}
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
export default confirmpayment;
