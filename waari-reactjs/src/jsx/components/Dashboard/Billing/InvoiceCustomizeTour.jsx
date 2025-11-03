import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { ToWords } from "to-words";
import logo from "../../../../assets/images/logo.png";
// import stamp from "../../../../assets/images/waari_stamp.png";
import EditInvoicePopUpCT from "./EditInvoicePopUpCT";
import PopupModal from "../Popups/PopupModal";
import stamp from "../../../../assets/images/waari_stamp.png";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import BackButton from "../../common/BackButton";
const InvoiceCustomizeTour = () => {
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
	const { id, idPayment } = useParams();
	const [invoice, setInvoice] = useState(null);
	const [open, setOpen] = useState(false);
	const { permissions } = useSelector((state) => state.auth);

	const getInvoice = async () => {
		try {
			const response = await get(
				`/view-invoice-ct?enquiryCustomId=${id}&enquiryDetailCustomId=${idPayment}`
			);
			setInvoice(response?.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getInvoice();
		// While view farmer page is active, the yadi tab must also activated
		const pathArray = window.location.href.split("/");
		const path = pathArray[pathArray.length - 1];
		let element = document.getElementById("booking-record");
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
		getInvoice();
	};

	return (
		<>
			{open && (
				<PopupModal open={true} onDialogClose={handleDialogClose}>
					<EditInvoicePopUpCT
						enquiryDetailCustomId={idPayment}
						invoiceData={invoice}
						onClose={handleDialogClose}
					/>
				</PopupModal>
			)}

			<div className="card breadcrumb-card"  style={{ marginBottom: '40px' }}>
				<div className="row page-titles mx-0 fixed-top-breadcrumb">
					   <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
						<li className="breadcrumb-item active">
							<Link to="/dashboard">Dashboard</Link>
						</li>
						<li className="breadcrumb-item  ">
							<Link to="/invoice">Invoice</Link>
						</li>
					</ol>
				</div>
			</div>
			<div className="card card-btn">
				<div className="card-body">
					<div className="no-print d-flex justify-content-end  gap-2">
						{hasComponentPermission(permissions, 154) && (
							<button
								className="btn btn-primary filter-btn mt-0"
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
								<b style={{ marginLeft: "5px", color: "#fff" }}>Edit Invoice</b>
							</button>
						)}
						<button
							className=" no-print btn btn-sm add-btn btn-secondary"
							onClick={() => print()}
						>
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
			<div className="card card-invoice">
				<div className="card-body">
					<div className="row">
						<div className="col-md-6 logo-invoice">
							<img src={logo} alt="logo" />
						</div>
						<div className="col-md-6 tax-invoice">
							<h3>Tax Invoice</h3>
							<div className="form-group row">
								<h4 className="mb-0 col-md-3 col-6">Invoice No.</h4>
								<p className="mb-0 col-md-3  col-6">
									{invoice?.invoiceNo || "--"}{" "}
								</p>
							</div>
							<div className="form-group row">
								<h4 className="mb-0 col-md-3 col-6">Date</h4>
								<p className="mb-0 col-md-3 col-6">
									{invoice?.invoiceDate || "--"}
								</p>
							</div>
						</div>
					</div>
					<div className="row mt-4 mb-2 invoice-details">
						<div className="col-md-3">
							<div className="bill-details">
								<p className="mb-0 p-0">Bill To </p>
								<h3 className="p-0">{invoice?.billingName || "--"}</h3>
								<p className="address p-0">{invoice?.address || "------"}</p>
							</div>
						</div>
						<div className="col-md-3 inovice-none"></div>
						<div className="col-md-6 d-flex align-items-end">
							<div className="form-group row " style={{ width: "100%" }}>
								<div className="card-header" style={{ paddingLeft: "1rem" }}>
									<div className="card-title h5">Advance Receipts </div>
								</div>
								{invoice?.paidReceipts?.map((receipt, index) => (
									<div className="row">
										<div className=" col-md-4 col-6">
											<h4 className="mb-0">Receipt No {index + 1}</h4>
										</div>
										<div className="col-md-3 col-6">
											<p className="mb-0 " key={index}>
												{receipt.receiptNo}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="row invoice-details-contact">
						<div className="col-md-6">
							<div className="form-group row">
								<h4 className="mb-0 col-md-2 col-6">Mob:</h4>
								<p className="mb-0 col-md-3 second-row col-6">
									{invoice?.phoneNo || "--"}{" "}
								</p>
							</div>
							<div className="form-group row">
								<h4 className="mb-0 col-md-2 col-6">GSTIN: </h4>
								<p className="mb-0 col-md-3 second-row col-6">
									{invoice?.gstin || "--"}{" "}
								</p>
							</div>
							<div className="form-group row">
								<h4 className="mb-0 col-md-2 col-6">PAN: </h4>
								<p className="mb-0col-md-3 second-row col-6">
									{invoice?.panNo || "--"}{" "}
								</p>
							</div>
						</div>
					</div>

					<div className="invoice-table-details mt-2">
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
												{invoice?.destination?.toUpperCase()} TOUR
											</p>
											<p className="mb-0">{invoice?.tourName?.toUpperCase()}</p>
										</td>
										<td className="text-center">
											<p className="mb-0">{invoice?.night || "--"} Nights</p>
											<p className="mb-0">{invoice?.days || "--"} Days</p>
										</td>
										<td className="text-center">
											<p className="mb-0">{invoice?.adults || "--"} Adult(s)</p>
											<p className="mb-0">{invoice?.child || "--"} childs</p>
										</td>
										<td className="text-center">
											₹ {invoice?.tourPrice || "--"}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div className="row invoice-discount">
						<div className="col-md-9 inovice-visible"></div>
						<div className="col-md-3">
							<div className="form-group d-flex justify-content-between">
								<h4 className="mb-0 ">
									<span className="invoice-color-blue">DISCOUNT</span>
								</h4>
								<p className="mb-0">
									<span className="invoice-color-blue">
										-₹ {invoice?.discount || "--"}
									</span>
								</p>
							</div>
							<div className="form-group  d-flex justify-content-between">
								<h4 className="mb-0">
									<span className="invoice-color-black">TAXABLE AMOUNT </span>
								</h4>
								<p className="mb-0">
									<span className="invoice-color-black">
										₹ {invoice?.afterDiscountPrice}
									</span>
								</p>
							</div>
							<div className="form-group  d-flex justify-content-between">
								<h4 className="mb-0">CGST @ 2.5%</h4>
								<p className="mb-0">₹ {invoice?.cgst || "--"}</p>
							</div>
							<div className="form-group  d-flex justify-content-between">
								<h4 className="mb-0">SGST @ 2.5%</h4>
								<p className="mb-0">₹ {invoice?.sgst || "--"} </p>
							</div>
							{invoice?.destinationId == 2 && (
								<div className="form-group  d-flex justify-content-between">
									<h4 className="mb-0">TCS @ 5%</h4>
									<p className="mb-0">₹ {invoice?.tcs || "--"} </p>
								</div>
							)}
							<div className="divider-invoice mt-2 ">
								<img src="assets\images\divider.png" alt="" />
							</div>
							<div className="form-group mt-2 d-flex justify-content-between">
								<h4 className="mb-0">GRAND TOTAL</h4>
								<p className="mb-0">₹ {invoice?.grandTotal || "--"}</p>
							</div>
						</div>
					</div>
					<div className="row invoice-words mt-3 ">
						<div className="col-md-9">
							<div className="form-group d-block">
								<p className="mb-0 ">Amount in words</p>
								<h3 className="mb-0">
									{isNaN(invoice?.grandTotal)
										? "--"
										: toWords.convert(parseInt(invoice?.grandTotal), {
												currency: true,
										  })}
								</h3>
							</div>
						</div>
						{/* <div className="col-md-3">

            </div> */}
					</div>
					<div className="row invoice-address mt-3 mb-2">
						<div className="col-md-3">
							<p className="mb-0">
								<b>waari.in</b> is a Registered Brand of{" "}
							</p>
							<p className="mb-0">
								<b>Musmade Hospitality Pvt. Ltd.</b>
							</p>
							<p className="mb-0">
								Shop no: 7, LaCasita Complex, Near TJSB Bank, Sector - 32A,
								Ravet, Pune - 412101
							</p>
						</div>
						<div className="col-md-6 inovice-none"></div>
						<div className="col-md-3 d-flex justify-content-end flex-column">
							<img src={stamp} alt="stamp" width={120} className="m-auto" />
							<p className="mb-0">For MUSMADE HOSPITALITY PVT. LTD.</p>
						</div>
					</div>

					<div className="invoice-table-details invoice-table-details2">
						<div className="table-responsive">
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
							{/* <li><span></span></li> */}
						</ul>
					</div>
					<div className="invoice-data mt-2 mb-2">
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
export default InvoiceCustomizeTour;
