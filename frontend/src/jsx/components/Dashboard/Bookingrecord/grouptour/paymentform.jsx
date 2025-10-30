import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get } from "../../../../../services/apiServices";

const PaymentForm = ({
	familyHead,
	enquiryId,
	grandTotal,
	advancePayment,
	balance,
}) => {

	// to get the group tour bill details start
	const [groupTourBillDetails, setGroupTourBillDetails] = useState([]);

	const getGroupTourBillDetails = async () => {
		try {
			const response = await get(
				`/view-bill-group-tour?familyHeadGtId=${familyHead.familyHeadGtId}`
			);
			setGroupTourBillDetails(response?.data?.data);
			// console.log(response)
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getGroupTourBillDetails();
	}, []);

	useEffect(() => {
		// While view farmer page is active, the yadi tab must also activated
		const pathArray = window.location.href.split("/");
		const path = pathArray[pathArray.length - 1];
		let element = document.getElementById("confirm-group-tour");
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
			<div className="needs-validation">
				<div className="card-header mb-2 p-0 card-header-second">
					<div className="card-title h5">Previous Payments</div>
				</div>
				<div className="col-lg-12 mt-2">
				<div className="tour-part">
					<div className="row">
						<div className="col-md-3">
							<label>
								Tour Cost<span className="error-star">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								placeholder=""
								name="tourcost"
								value={grandTotal}
								disabled
								style={{border:"1px solid #076fb0",color:"#076fb0",fontWeight:"600"}}
							/>
						</div>
						<div className="col-md-3">
							<label>
								Paid<span className="error-star">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								placeholder=""
								name="paid"
								value={advancePayment}
								disabled
								style={{border:"1px solid #299e4a",color:"#299e4a",fontWeight:"600"}}
							/>
						</div>
						<div className="col-md-3">
							<label>
								Balance<span className="error-star">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								placeholder=""
								name="balance"
								value={balance}
								disabled
								style={{border:"1px solid #ff0000",color:"#ff0000",fontWeight:"600"}}
							/>
						</div>
					</div>
					</div>
				</div>

				<div className="basic-form">
					<div className="mb-2 row">
						<div className="col-md-3">
							<label className="form-label">Billing Name</label>
						</div>
						<div className="col-md-5">
							<div className="view-details">
								<h6>{groupTourBillDetails?.billingName}</h6>
							</div>
						</div>
					</div>
					<div className="mb-2 row">
						<div className="col-md-3">
							<label className="form-label">Address</label>
						</div>
						<div className="col-md-5">
							<div className="view-details">
								<h6>{groupTourBillDetails?.address}</h6>
							</div>
						</div>
					</div>
					<div className="mb-2 row">
						<div className="col-md-3">
							<label className="form-label">Phone No.</label>
						</div>
						<div className="col-md-5">
							<div className="view-details">
								<h6>{groupTourBillDetails?.phoneNumber}</h6>
							</div>
						</div>
					</div>

					<div className="mb-2 row">
						<div className="col-md-3">
							<label className="form-label">GSTIN</label>
						</div>
						<div className="col-md-5">
							<div className="view-details">
								<h6>{groupTourBillDetails?.gstIn}</h6>
							</div>
						</div>
					</div>
					<div className="mb-2 row">
						<div className="col-md-3">
							<label className="form-label">PAN Number</label>
						</div>
						<div className="col-md-5">
							<div className="view-details">
								<h6>{groupTourBillDetails?.panNumber}</h6>
							</div>
						</div>
					</div>
					<div className="mb-2 row">
						<div className="col-md-3">
							<label className="form-label">Grand Total</label>
						</div>
						<div className="col-md-5">
							<div className="view-details">
								<h6 style={{color:"#299e4a"}}>{groupTourBillDetails?.grandTotal}</h6>
							</div>
						</div>
					</div>

					{groupTourBillDetails?.advancePayments &&
						groupTourBillDetails?.advancePayments.map((item, index) => {
							return (
								<>
									<div className="mb-2 row">
										<div className="col-md-3">
											<label className="form-label">Advance {index + 1}</label>
										</div>
										<div className="col-md-5">
											<div className="view-details">
												<h6>{item?.advancePayment}</h6>
											</div>
										</div>
										<div className="col-md-4">
											<div className="">
												<div key={index}>
													{item.status == 0 ? (
														<>
															<badge className="badge light badge-warning">
																Pending
															</badge>
															<badge className="badge badge-warning">
																{item.receiptNo}
															</badge>
														</>
													) : (
														<>
															<div className="d-flex  mt-2 mt-lg-0 mt-md-0">
																<badge className="badge light badge-success">
																	Confirm
																</badge>

																{
																	<Link
																		to={`/receipt/${familyHead.familyHeadGtId}/${item.groupPaymentDetailId}`}
																		className="btn btn-secondary add-btn btn-sm"
																		style={{
																			height: "32px",
																			margin: "0px 10px 0px 0px",
																			lineHeight: "1",
																		}}
																	>
																		View Receipt
																	</Link>
																}
															</div>
														</>
													)}
												</div>
											</div>
										</div>
									</div>
								</>
							);
						})}
					<div className="mb-2 row">
						<div className="col-md-3">
							<label className="form-label">Balance</label>
						</div>
						<div className="col-md-5">
							<div className="view-details">
								<h6 style={{color:'#ff0000'}}>{groupTourBillDetails?.balance}</h6>
							</div>
						</div>
						<div className="col-md-4">
							{groupTourBillDetails?.isPaymentDone && (
								<div className="col-md-4">
									<Link
										to={`/invoice/${familyHead.familyHeadGtId}`}
										className="btn btn-secondary add-btn btn-sm"
										style={{
											height: "32px",
											margin: "0px 10px 0px 0px",
											lineHeight: "1",
										}}
									>
										Invoice
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default PaymentForm;
