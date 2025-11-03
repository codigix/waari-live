import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { ToWords } from "to-words";
import logo from "../../../../assets/images/logo.png";
import EditReceiptPopUp from "./EditReceiptPopUpCT";
import PopupModal from "../Popups/PopupModal";
import stamp from "../../../../assets/images/waari_stamp.png";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import BackButton from "../../common/BackButton";
const ReceiptCt = () => {
	const { id, idPayment } = useParams();
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const { permissions } = useSelector((state) => state.auth);

	// to translate numbet to words start
	const toWords = new ToWords({
		localeCode: "en-IN",
		converterOptions: {
			currency: true,
			ignoreDecimal: false,
			ignoreZeroCurrency: false,
			doNotAddOnly: false,
			currencyOptions: {
				// can be used to override defaults for the selected locale
				name: "Rupee",
				plural: "Rupees",
				symbol: "₹",
				fractionalUnit: {
					name: "Paisa",
					plural: "Paise",
					symbol: "",
				},
			},
		},
	});

	// to translate numbet to words end

	// to get receipt data start
	const [receiptData, setReceiptData] = useState("");

	const getReceiptData = async () => {
		try {
			setIsLoading(true);
			const response = await get(`/view-receipt-ct?customPayDetailId=${id}`);
			setReceiptData(response?.data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};

	useEffect(() => {
		getReceiptData();
	}, []);

	const updateRupees = () => {
		const rupees = toWords.convert(
			receiptData?.advancePayment ? receiptData?.advancePayment : 0
		);
		const moneyArray = rupees.split(" ").slice(0, -2);
		const formattedMoney = moneyArray.join(" ");
		const formattedResult = `${formattedMoney} Only`;

		return formattedResult;
	};
	const money = updateRupees();

	useEffect(() => {
		// While view farmer page is active, the yadi tab must also activated
		const pathArray = window.location.href.split("/");
		const path = pathArray[pathArray.length - 1];
		let element = document.getElementById("group-tour");
		if (element) {
			element.classList.add("mm-active1"); // Add the 'active' class to the element
		}
		return () => {
			if (element) {
				element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
			}
		};
	}, []);

	const handleDialogClose = () => {
		setOpen(false);
		getReceiptData();
	};

	return (
		<>
			{open && (
				<PopupModal open={true} onDialogClose={handleDialogClose}>
					<EditReceiptPopUp
						enquiryDetailCustomId={idPayment}
						receiptData={receiptData}
						onClose={handleDialogClose}
					/>
				</PopupModal>
			)}

			<div className="card"  style={{ marginBottom: '40px' }}>
				<div className="row page-titles mx-0 fixed-top-breadcrumb">
					   <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
						<li className="breadcrumb-item active">
							<Link to="/dashboard">Dashboard</Link>
						</li>
						<li className="breadcrumb-item  ">
							<a>Receipt</a>
						</li>
					</ol>
				</div>
			</div>

			<div className="card card-btn">
				<div className="card-body">
					<div className="no-print d-flex justify-content-end gap-2">
						{hasComponentPermission(permissions, 154) && (
							<button
								className=" btn btn-primary filter-btn mt-0"
								onClick={() => setOpen(true)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="20"
									width="20"
									fill="#076fb0"
									viewBox="0 0 576 512"
								>
									<path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V299.6l-94.7 94.7c-8.2 8.2-14 18.5-16.8 29.7l-15 60.1c-2.3 9.4-1.8 19 1.4 27.8H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z" />
								</svg>
								<b style={{ marginLeft: "5px", color: "#fff" }}>Edit Receipt</b>
							</button>
						)}
						<button
							className=" no-print btn btn-sm add-btn btn-secondary"
							onClick={() => print()}
						>
							{/* <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            className="svg-add"
            viewBox="0 0 448 512"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg> */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="16"
								width="12"
								viewBox="0 0 384 512"
							>
								<path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z" />
							</svg>
							<span style={{ marginLeft: "5px" }}>Download pdf</span>
						</button>
					</div>
				</div>
			</div>
			<div className="card">
				<div className="card-body">
					<div className="row">
						<div className="col-md-6 logo-invoice">
							<img src={logo} alt="logo" />
						</div>
						<div className="col-md-6 tax-invoice">
							<h3>Receipt</h3>
							<div className="form-group row">
								<h4 className="mb-0 col-md-3 col-6"> Receipt No.</h4>
								<p className="mb-0 col-md-3 col-6">
									{isLoading
										? "Loading..."
										: !!receiptData?.receiptNo
										? receiptData?.receiptNo
										: "-"}
								</p>
							</div>
							<div className="form-group row">
								<h4 className="mb-0 col-md-3 col-6">Date</h4>
								<p className="mb-0 col-md-3 col-6">
									{isLoading
										? "Loading..."
										: !!receiptData?.paymentDate
										? receiptData?.paymentDate
										: "-"}
								</p>
							</div>
						</div>
					</div>
					<div className="row mt-2 mb-2 invoice-details">
						<div className="col-md-3">
							<div className="bill-details">
								<p
									className="mb-0 col-md-2 bill-to"
									style={{ color: "#000000a3 !important " }}
								>
									Bill To{" "}
								</p>
								<h3>
									{isLoading
										? "Loading..."
										: !!receiptData?.billingName
										? receiptData?.billingName
										: "-"}
								</h3>
								<p className="address">
									{isLoading
										? "Loading..."
										: !!receiptData?.address
										? receiptData?.address
										: "-"}
								</p>
							</div>
						</div>
						<div className="col-md-3 inovice-none"></div>
						<div className="col-md-6 ">
							<div className="form-group row">
								{/* <div className="card-header" style={{ paddingLeft: "1rem" }}>
                  <div className="card-title h5">Advance Receipts </div>
                </div> */}
								<h4 className="mb-0 col-md-4 col-6">Payment Date</h4>
								<p className="mb-0 col-md-3 col-6">
									{isLoading
										? "Loading..."
										: !!receiptData?.paymentDate
										? receiptData?.paymentDate
										: "-"}
								</p>
							</div>
							<div className="form-group row">
								<h4 className="mb-0 col-md-4 col-6"> Payment mode</h4>
								<p className="mb-0 col-md-3 col-6">
									{isLoading
										? "Loading..."
										: !!receiptData?.paymentMode
										? receiptData?.paymentMode
										: "-"}
								</p>
							</div>
							{receiptData?.paymentMode == "Online" && (
								<div className="form-group row">
									<h4 className="mb-0 col-md-4 col-6">Transaction Mode</h4>
									<p className="mb-0 col-md-3 col-6">
										{isLoading
											? "Loading..."
											: !!receiptData?.transactionMode
											? receiptData?.transactionMode
											: "-"}
									</p>
								</div>
							)}
							{receiptData?.paymentMode == "Online" && (
								<div className="form-group row">
									<h4 className="mb-0 col-md-4 col-6">Transaction Id</h4>
									<p className="mb-0 col-md-3 col-6">
										{isLoading
											? "Loading..."
											: !!receiptData?.transactionId
											? receiptData?.transactionId
											: "-"}
									</p>
								</div>
							)}
							{receiptData?.paymentMode == "Cheque" && (
								<div className="form-group row">
									<h4 className="mb-0 col-md-4 col-6"> Bank name</h4>
									<p className="mb-0 col-md-3 col-6">
										{isLoading
											? "Loading..."
											: !!receiptData?.bankName
											? receiptData?.bankName
											: "-"}
									</p>
								</div>
							)}
							{receiptData?.paymentMode == "Cheque" && (
								<div className="form-group row">
									<h4 className="mb-0 col-md-4 col-6"> Cheque no.</h4>
									<p className="mb-0 col-md-3 col-6">
										{isLoading
											? "Loading..."
											: !!receiptData?.chequeNo
											? receiptData?.chequeNo
											: "-"}
									</p>
								</div>
							)}
						</div>
					</div>
					<div className="row invoice-details-contact">
						<div className="col-md-6">
							<div className="form-group row">
								<h4 className="mb-0 col-md-2 col-6">Mob:</h4>
								<p className="mb-0 col-md-3 col-6 second-row">
									{isLoading
										? "Loading..."
										: !!receiptData?.phoneNo
										? receiptData?.phoneNo
										: "-"}
								</p>
							</div>
							<div className="form-group row">
								<h4 className="mb-0 col-md-2 col-6">GSTIN: </h4>
								<p className="mb-0 col-md-3 col-6 second-row">
									{isLoading
										? "Loading..."
										: !!receiptData?.gstIn
										? receiptData?.gstIn
										: "-"}
								</p>
							</div>
							<div className="form-group row">
								<h4 className="mb-0 col-md-2 col-6">PAN: </h4>
								<p className="mb-0 col-md-3 col-6 second-row">
									{isLoading
										? "Loading..."
										: !!receiptData?.panNo
										? receiptData?.panNo
										: "-"}
								</p>
							</div>
						</div>
					</div>

					<div className="invoice-table-details mt-3 mb-3">
						{/* <div className="col-md-12"> */}
						<div className="table-responsive">
							<table className="invoice-table table">
								<thead>
									<tr>
										<th>DESCRIPTION OF SERVICE</th>
										<th className="text-center">DURATION</th>
										<th className="text-center">NO. OF PAX</th>
										<th className="text-center">AMOUNT</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<p className="mb-0">
												{isLoading
													? "Loading..."
													: !!receiptData?.destination
													? receiptData?.destination
													: "-"}
											</p>
											<p className="mb-0">
												{isLoading
													? "Loading..."
													: !!receiptData?.groupName
													? receiptData?.groupName
													: "-"}
											</p>
										</td>
										<td className="text-center">
											<p className="mb-0">
												{isLoading
													? "Loading..."
													: receiptData?.nights == 0
													? 0
													: !!receiptData?.nights
													? receiptData?.nights
													: "-"}{" "}
												Nights
											</p>
											<p className="mb-0">
												{isLoading
													? "Loading..."
													: receiptData?.days == 0
													? 0
													: !!receiptData?.days
													? receiptData?.days
													: "-"}{" "}
												Days
											</p>
										</td>
										<td className="text-center">
											<p className="mb-0">
												{isLoading
													? "Loading..."
													: receiptData?.adults == 0
													? 0
													: !!receiptData?.adults
													? receiptData?.adults
													: "-"}{" "}
												Adult(s)
											</p>
											<p className="mb-0">
												{isLoading
													? "Loading..."
													: receiptData?.child == 0
													? 0
													: !!receiptData?.child
													? receiptData?.child
													: "-"}{" "}
												childs
											</p>
										</td>
										<td className="text-center">
											₹{" "}
											{isLoading
												? "Loading..."
												: !!receiptData?.advancePayment
												? receiptData?.advancePayment
												: "-"}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						{/* </div> */}
					</div>
					<div className="row invoice-discount">
						<div className="col-md-9 inovice-visible"></div>
						<div className="col-md-3">
							{/* <div className="form-group d-flex justify-content-between">
                <h4 className="mb-0 ">TOUR PRICE</h4>
                <p className="mb-0">₹ {isLoading ? "Loading..." : !!(receiptData?.totalTourPrice)?receiptData?.totalTourPrice:"-"}</p>
              </div> */}
							<div className="form-group d-flex justify-content-between">
								<h3 className="mb-0 ">Grand Total</h3>
								<h3 className="mb-0">
									<span className="me-1">₹</span>
									{!!receiptData?.advancePayment
										? receiptData?.advancePayment
										: "-"}
								</h3>
							</div>
							{/* <div className="form-group  d-flex justify-content-between">
                <h4 className="mb-0">TOTAL AMOUNT PAID TILL DATE</h4>
                <p className="mb-0">₹ {isLoading ? "Loading..." : !!(receiptData?.alreadyPaid)?receiptData?.alreadyPaid:"-"}</p>
              </div> */}
							{/* <div className="form-group  d-flex justify-content-between">
                <h4 className="mb-0">CGST @ 2.5%</h4>
                <p className="mb-0">₹ 1,485.00</p>
              </div>
              <div className="form-group  d-flex justify-content-between">
                <h4 className="mb-0">SGST @ 2.5%</h4>
                <p className="mb-0">₹ 1,485.00 </p>
              </div> */}
							{/* <div className="form-group  d-flex justify-content-between">
                <h4 className="mb-0">REMAINING PAYMENT</h4>
                <p className="mb-0">₹ {isLoading ? "Loading..." : !!(receiptData?.remainingAmount)?receiptData?.remainingAmount:"-"}</p>
              </div> */}
						</div>
					</div>
					<div className="row invoice-word mt-3">
						<div className="col-md-9">
							<div className="form-group d-block">
								<p className="mb-0 ">Amount in words</p>
								<h3 className="mb-0">
									{`${
										isLoading
											? "Loading..."
											: !!receiptData?.advancePayment
											? `Rupees ${money}`
											: "-"
									}`}
								</h3>
							</div>
						</div>
						<div className="col-md-3"></div>
					</div>
					<div className="row invoice-address mt-3 mb-3">
						<div className="col-md-3">
							<p className="mb-0">
								<b>waari.in</b> is a Registered Brand of{" "}
							</p>
							<p className="mb-0">
								<b>Musmade Hospitality Pvt. Ltd.</b>
							</p>
							<p className="mb-0">
								Shop no: 7, LaCasita Complex,
								<br /> Near TJSB Bank, Sector - 32A,
								<br />
								Ravet, Pune - 412101
							</p>
						</div>
						<div className="col-md-6 inovice-none"></div>
						<div className="col-md-3 d-flex justify-content-end flex-column">
							<img src={stamp} alt="stamp" width={120} className="m-auto" />
							<p className="mb-0 text-center">
								For MUSMADE HOSPITALITY PVT. LTD.
							</p>
						</div>
					</div>
					<div className="table-responsive">
						<div className="invoice-table-details mt-3">
							<table
								className="invoice-table table"
								style={{ borderTop: "1px solid #000", marginBottom: "0" }}
							>
								<tbody>
									<tr>
										<td>PAN: AAPCM4986P</td>
										<td>GSTIN: 27AAPCM4986P1Z9</td>
									</tr>
									<tr>
										<td>SAC: 998555 (Tour Operator)</td>
										<td>CIN: U63000PN2022PTC208864</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div className="invoice-note">
						<ul>
							<li>
								<span>
									Terms & Conditions: For all the terms & conditions, please
									visit www.waari.in .Receipt Subject to Cheque Realisation
								</span>
							</li>
						</ul>
					</div>
					<div className="invoice-data mt-5 mb-4">
						<h3 className="text-center">
							THANK YOU FOR CHOOSING{" "}
							<span className="invoice-color-blue">Waari.in</span> AS YOUR
							TRAVEL PARTNER
						</h3>
					</div>
					<div className="invoice-footer mb-2">
						<div className="row">
							<div className="col-md-6">
								<h2>Desh ka Travel Partner</h2>
							</div>
							<div className="col-md-6">
								<span>
									©2021-22 Musmade Hospitality Pvt Ltd. All Rights Reserved.
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default ReceiptCt;
