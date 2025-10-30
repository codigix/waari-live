import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get, post } from "../../../../../services/apiServices";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import BackButton from "../../../common/BackButton";
const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "50%",
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 2,
};
const Detailcustomizedtour = () => {
	const navigate = useNavigate();
	const { id, idPayment } = useParams();
	const { permissions } = useSelector((state) => state.auth);
	
	const [open, setOpen] = React.useState(false);
	const [proof, setProof] = React.useState("");
	
	const handleOpen = (proof) => {
		setOpen(true);
		setProof(proof);
	}
	const handleClose = () => setOpen(false);

	//to start details
	const [data, setData] = useState([]);
	const [advance, setAdvance] = useState([]);
	const getbillingdetails = async () => {
		try {
			const response = await get(
				`/view-bill-ct?enquiryDetailCustomId=${idPayment}`
			);
			setData(response.data.data);
			setAdvance(response?.data?.data?.advancePayments);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getbillingdetails();
	}, []);

	//to end details

	//to start payment details
	const [data_next, setData_next] = useState([]);

	const getpaymentdetails = async () => {
		try {
			const response = await get(
				`/view-new-pay-ct?enquiryDetailCustomId=${idPayment}`
			);
			setData_next(response.data.data);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getpaymentdetails();
	}, []);

	useEffect(() => {
		// While view farmer page is active, the yadi tab must also activated
		// console.log(window.location.href.split("/"));
		const pathArray = window.location.href.split("/");
		const path = pathArray[pathArray.length - 1];
		// console.log(path);
		let element = document.getElementById("billing-customized-tour");
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
	const [showFullScreen, setShowFullScreen] = useState(false);

	const handleImageClick = () => {
		setShowFullScreen(true);
	};

	const handleCloseFullScreen = () => {
		setShowFullScreen(false);
	};

	const generateReceipt = async (item) => {
		try {
			const response = await post(
				`/update-pay-status-ct?customPayDetailId=${item.customPayDetailId}&enquiryDetailCustomId=${idPayment}`
			);
			toast.success(response?.data?.message);
			getbillingdetails();
			getpaymentdetails();
		} catch (error) {
			console.log(error);
		}
	};

	//to end payment details
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
							<Link to="/billing-customized-tour">Billing</Link>
						</li>
						<li className="breadcrumb-item  ">
							<Link to="javascript:void(0)">Customized Tour</Link>
						</li>
					</ol>
				</div>
			</div>
			{hasComponentPermission(permissions, 52) && (
				<div className="card">
					<div className="card-header">
						<div className="card-title h5">Previous Payments</div>
					</div>
					<div className="card-body">
						<div className="basic-form">
							<form>
								<div className="mb-2 row">
									<div className="col-md-3">
										<label className="form-label">Billing Name</label>
									</div>
									<div className="col-md-4">
										<div className="view-details">
											<h6>{data.billingName}</h6>
										</div>
									</div>
									<div className="col-md-5">
										<div className="d-flex">
											<Link
												to=""
												className="btn btn-warning pdf-btn btn-sm d-none"
												style={{
													height: "32px",
													margin: "0 10px 0 0",
													lineHeight: "1",
												}}
											>
												Edit
											</Link>
										</div>
									</div>
								</div>
								<div className="mb-2 row">
									<div className="col-md-3">
										<label className="form-label">Address</label>
									</div>
									<div className="col-md-4">
										<div className="view-details">
											<h6>{data.address}</h6>
										</div>
									</div>
									<div className="col-md-5">
										<div className="d-flex">
											<Link
												to=""
												className="btn btn-warning pdf-btn btn-sm  d-none"
												style={{
													height: "32px",
													margin: "0 10px 0 0",
													lineHeight: "1",
												}}
											>
												Edit
											</Link>
										</div>
									</div>
								</div>
								<div className="mb-2 row">
									<div className="col-md-3">
										<label className="form-label">Phone No.</label>
									</div>
									<div className="col-md-4">
										<div className="view-details">
											<h6>{data.phoneNumber}</h6>
										</div>
									</div>
									<div className="col-md-5">
										<div className="d-flex">
											<Link
												to=""
												className="btn btn-warning pdf-btn btn-sm  d-none"
												style={{
													height: "32px",
													margin: "0 10px 0 0",
													lineHeight: "1",
												}}
											>
												Edit
											</Link>
										</div>
									</div>
								</div>

								<div className="mb-2 row">
									<div className="col-md-3">
										<label className="form-label">GSTIN</label>
									</div>
									<div className="col-md-4">
										<div className="view-details">
											<h6>{data.gstIn}</h6>
										</div>
									</div>
									<div className="col-md-5">
										<div className="d-flex">
											<Link
												to=""
												className="btn btn-warning pdf-btn btn-sm  d-none"
												style={{
													height: "32px",
													margin: "0 10px 0 0",
													lineHeight: "1",
												}}
											>
												Edit
											</Link>
										</div>
									</div>
								</div>
								<div className="mb-2 row">
									<div className="col-md-3">
										<label className="form-label">PAN Number</label>
									</div>
									<div className="col-md-4">
										<div className="view-details">
											<h6>{data.panNumber}</h6>
										</div>
									</div>
									<div className="col-md-5">
										<div className="d-flex">
											<Link
												to=""
												className="btn btn-warning pdf-btn btn-sm  d-none"
												style={{
													height: "32px",
													margin: "0 10px 0 0",
													lineHeight: "1",
												}}
											>
												Edit
											</Link>
										</div>
									</div>
								</div>
								<div className="mb-2 row">
									<div className="col-md-3">
										<label className="form-label">Grand Total</label>
									</div>
									<div className="col-md-4">
										<div className="view-details">
											<h6>{data.grandTotal}</h6>
										</div>
									</div>
								</div>
								{advance.map((item, index) => (
									<div className="mb-2 row">
										<div className="col-md-3">
											<label className="form-label">Advance {index + 1}</label>
										</div>
										<div className="col-md-4">
											<div className="view-details">
												<h6 key={index}>{`${item.advancePayment}`}</h6>
											</div>
										</div>
										<div className="col-md-5 mt-2 mt-lg-0 mt-md-0">
											{item.status == 0 ? (
												<>
													<badge className="badge light badge-warning">Pending</badge>
												</>
											) : (
												<>
													<div className="d-flex">
														<span
															onClick={() => {
																navigate(
																	`/receipt-ct/${item?.customPayDetailId}/${idPayment}`
																);
															}}
														>
															<Link
																className="btn btn-secondary add-btn pdf-btn btn-sm"
																style={{
																	height: "32px",
																	margin: "0 10px 0 0",
																	lineHeight: "1",
																}}
															>
																{" "}
																View Receipt
															</Link>
														</span>
													</div>
												</>
											)}
										</div>
									</div>
								))}
								
								<div className="mb-2 row">
									<div className="col-md-3">
										<label className="form-label">Balance</label>
									</div>
									<div className="col-md-4">
										<div className="view-details">
											<h6>{data.balance}</h6>
										</div>
									</div>
									<div className="col-md-4">
										{data?.isPaymentDone && (
											<div className="col-md-4">
												<Link
													to={`/invoice-ct/${id}/${idPayment}`}
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
							</form>
						</div>
					</div>
				</div>
			)}
			{hasComponentPermission(permissions, 53) &&
				data_next.map((item, index) => (
					<div className="card">
						<div className="card-header">
							<div className="card-title h5">Pending Payment</div>
						</div>
						<div className="card-body">
							<div className="basic-form">
								<form>
									<div className="mb-2 row">
										<div className="col-md-3">
											<label className="form-label">New Payment Amount</label>
										</div>
										<div className="col-md-4">
											<div className="view-details">
												<h6 key={index}>{item.advancePayment}</h6>
											</div>
										</div>
									</div>
									<div className="mb-2 row">
										<div className="col-md-3">
											<label className="form-label">Payment Mode</label>
										</div>
										<div className="col-md-4">
											<div className="view-details">
												<h6 key={index}>{item.paymentModeName}</h6>
											</div>
										</div>
									</div>
									{item.onlineTypeName && (
										<div className="mb-2 row">
											<div className="col-md-3">
												<label className="form-label">Online Transaction</label>
											</div>
											<div className="col-md-4">
												<h6 className="view-details" key={index}>
													{item.onlineTypeName}
												</h6>
											</div>
										</div>
									)}
									{/* <div className="row mb-2">
                  <div className="col-md-3">
                    <label className="form-label">Amount</label>
                  </div>
                  <div className="col-md-4">
                    <h6 className="view-details" key={index}>1000</h6>
                  </div>
                </div> */}
									{item.bankName && (
										<div className="mb-2 row">
											<div className="col-md-3">
												<label className="form-label">Bank Name</label>
											</div>
											<div className="col-md-4">
												<div className="view-details">
													<h6 key={index}>{item.bankName}</h6>
												</div>
											</div>
										</div>
									)}
									{item.chequeNo && (
										<div className="mb-2 row">
											<div className="col-md-3">
												<label className="form-label">Cheque No.</label>
											</div>
											<div className="col-md-4">
												<div className="view-details">
													<h6 key={index}>{item.chequeNo}</h6>
												</div>
											</div>
										</div>
									)}
									<div className="mb-2 row">
										<div className="col-md-3">
											<label className="form-label">Date of payment</label>
										</div>
										<div className="col-md-4">
											<div className="view-details">
												<h6 key={index}>{item.payDate}</h6>
											</div>
										</div>
									</div>

									{item.transactionId && (
										<>
											<div className="mb-2 row">
												<div className="col-md-3">
													<label className="form-label">Transaction ID</label>
												</div>
												<div className="col-md-4">
													<div className="view-details">
														<h6 key={index}>{item.transactionId}</h6>
													</div>
												</div>
											</div>
										</>
									)}

									<div className="mb-2 row">
										<div className="col-md-3">
											<label className="form-label">Transaction Proof</label>
										</div>
										<div className="col-md-2">
											{/* <img
												src={item.transactionProof}
												alt="proof"
												style={{
													maxWidth: "100%",
													height: "120px",
													width: "200px",
												}}
											/>
											<button
												type="button"
												className="btn btn-primary filter-btn"
												onClick={()=> handleOpen(item.transactionProof)}
											>
												View
												
											</button> */}
												<a
												href={item.transactionProof}
												target="_blank"
												className="btn btn-primary filter-btn"
											>
												View
											</a>
										</div>
									</div>

									{hasComponentPermission(permissions, 54) && (
										<div className="mb-2 row">
											<div className="col-lg-12 d-flex justify-content-end">
												<button
													type="button"
													onClick={() => generateReceipt(item)}
													className="btn btn-submit btn-primary"
												>
													Generate Recipet
												</button>
											</div>
										</div>
									)}
								</form>
							</div>
						</div>
						<Modal
							aria-labelledby="transition-modal-title"
							aria-describedby="transition-modal-description"
							open={open}
							onClose={handleClose}
							closeAfterTransition
							slots={{ backdrop: Backdrop }}
							slotProps={{
								backdrop: {
									timeout: 500,
								},
							}}
						>
							<Fade in={open}>
								<Box sx={style}>
									<Typography>
										<Link
											onClick={() => setOpen(false)}
											className="close d-flex justify-content-end text-danger"
										>
											<span>&times;</span>
										</Link>
									</Typography>
									<div className="image-container">
										<img
											src={proof} // Replace with your image source
											alt="Zoomable Image"
										/>
									</div>
								</Box>
							</Fade>
						</Modal>
					</div>
				))}
			<div className="card">
				<div className="card-body">
					<div className="row">
						<div className="col-lg-12 d-flex justify-content-start">
							<Link
								to="/billing-customized-tour"
								type="submit"
								className="btn btn-back"
							>
								Back
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Detailcustomizedtour;
