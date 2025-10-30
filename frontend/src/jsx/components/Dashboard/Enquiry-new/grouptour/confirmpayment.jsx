import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Paymentform from "./paymentform";
import { get } from "../../../../../services/apiServices";
import { useSelector } from "react-redux";

const confirmpayment = ({ enquiryId }) => {
	const [familyHeadsList, setFamilyHeadsList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [familyHeadTab, setFamilyHeadTab] = useState(familyHeadsList[0]?.path);
	const [selectedFamilyHeadId, setSelectedFamilyHeadId] = useState(
		familyHeadsList.find(fHead => fHead.status == 1)?.familyHeadGtId
	);

	const [grandTotal, setGrandTotal] = useState("");
	const [advancePayment, setAdvancePayment] = useState("");
	const [balance, setBalance] = useState("");

	const [rerender, setRerender] = useState(false);

	const handleRerender = () => {
		setRerender(!rerender);
	};

	const getFamilyHeadsList = async () => {
		try {
			setIsLoading(true);
			const reponse = await get(
				`/familyHead-list-gt?enquiryGroupId=${enquiryId}`
			);

			const transformedFamilyHeadsList = reponse.data?.data.map((fHead) => ({
				isPaymentDone: Boolean(fHead.status),
				familyHeadGtId: fHead.familyHeadGtId,
				familyHeadName: fHead.preFixName + fHead.firstName + fHead.lastName,
				path: fHead.firstName + fHead.lastName,
				label: fHead.preFixName + " " + fHead.firstName + " " + fHead.lastName,
			}));

			setFamilyHeadTab(transformedFamilyHeadsList.find(fHead => fHead.isPaymentDone)?.path);
			setSelectedFamilyHeadId(transformedFamilyHeadsList.find(fHead => fHead.isPaymentDone)?.familyHeadGtId);

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
			getPaymentDetails(familyHeadsList.find(fHead => fHead.isPaymentDone)?.familyHeadGtId);
		}
	}, [selectedFamilyHeadId, rerender]);

	const getPaymentDetails = async (id) => {
		try {
			setIsLoading(true);
			const response = await get(
				`/view-payment-bill-gt?familyHeadGtId=${
					selectedFamilyHeadId ? selectedFamilyHeadId : id
				}&enquiryGroupId=${enquiryId}`
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
													key={item.familyHeadGtId}
													className={`nav-item cursor-pointer`}
													onClick={() => {
														// setURLSearchParams({ familyHeadTab: item.path });

														if (item.isPaymentDone) {
															setFamilyHeadTab(item.path);
															setSelectedFamilyHeadId(item.familyHeadGtId);
														}
													}}
												>
													<div
														className={`nav-link  ${
															familyHeadTab === item.path ? "active" : ""
															}`}
														style={ !item.isPaymentDone ? { backgroundColor: "#f3f3f3" } : null}
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
