import React, { useEffect, useState } from "react";
import PopupModal from "../../Popups/PopupModal";
import ProcessrefundModal from "./ProcessrefundModal";
import CreditnoteModal from "./CreditnoteModal";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { get, post } from "../../../../../services/apiServices";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
const url = import.meta.env.VITE_WAARI_BASEURL;

const initialValues = {
	cancellationReason: "",
	cancellationCharges: "",
	refundAmount: "",
	document: "",
};

const validationSchema = yup.object().shape({
	cancellationReason: yup.string().required("Reason is Required"),
	cancellationCharges: yup.string().required("Charges is Required"),
	refundAmount: yup.string().required("Refund Amount is Required"),
	document: yup.string(),
});

const getFileLink = async (file) => {
	try {
		const formData = new FormData();
		formData.append("image", file);
		const responseData = await axios.post(
			`
          ${url}/image-upload`,
			formData
		);
		toast.success("File uploaded successfully");
		return responseData?.data?.image_url;
	} catch (error) {
		toast.error(error?.response?.data?.message?.toString());
		console.log(error);
	}
};

function CancelEnquiryModal({
	onClose,
	cancelMemberDetails,
	familyHeadDetails,
	enquiryId,
	reRenderCancelledMembersOnProofUpload,
}) {
	const [isLoading, setIsLoading] = useState(false);

	const [isSubmitting, setIsSubmitting] = useState(false);

	// to handle process refund process
	const [processRefund, setProcessRefund] = useState(false);

	const handleDialogClose = () => {
		setProcessRefund(false);
		onClose(false);
		reRenderCancelledMembersOnProofUpload();
	};

	// to handle credit note  process
	const [creditNote, setCreditNote] = useState(false);

	const handleCreditNoteDialogClose = () => {
		setCreditNote(false);
		onClose(false);
		reRenderCancelledMembersOnProofUpload();
	};

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			// 1.get All Values and submit that to api and 2.then Close the Both PopUps and 3.then Refresh Family Members List Data
			try {
				{
					if (values.refundAmount == 0) {
						setIsSubmitting(true);

						const data = {
							...values,
							enquiryCustomId: enquiryId,
							enquiryDetailCustomId: familyHeadDetails.enquiryDetailCustomId,
							customGuestDetailsId: cancelMemberDetails.customGuestDetailsId,
							guestId: cancelMemberDetails.guestId,
						};

						const result = await post("cancel-ct", data);

						toast.success(result?.data?.message);

						onClose(false);
						reRenderCancelledMembersOnProofUpload();
						setIsSubmitting(false);
					}
				}
			} catch (error) {
				setIsSubmitting(false);
				console.log(error);
			}
		},
	});

	useEffect(() => {
		const getRefundDetails = async () => {
			try {
				setIsLoading(true);
				const response = await get(
					`refund-calculation-ct?customGuestDetailsId=${cancelMemberDetails.customGuestDetailsId}`
				);

				formik.setFieldValue("refundAmount", response.data?.refundAmount);
				formik.setFieldValue(
					"cancellationCharges",
					response.data?.cancelCharge
				);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		getRefundDetails();
	}, []);

	const data = {
		enquiryCustomId: enquiryId,
		enquiryDetailCustomId: familyHeadDetails.enquiryDetailCustomId,
		customGuestDetailsId: cancelMemberDetails.customGuestDetailsId,
		guestId: cancelMemberDetails.guestId,
		refundAmount: formik.values.refundAmount,
		cancellationCharges: formik.values.cancellationCharges,
		cancellationReason: formik.values.cancellationReason,
		document: formik.values.document,
	};

	return (
		<>
			{processRefund && (
				<PopupModal open={true} onDialogClose={handleDialogClose}>
					<ProcessrefundModal onClose={handleDialogClose} previousData={data} />
				</PopupModal>
			)}

			{creditNote && (
				<PopupModal open={true} onDialogClose={handleDialogClose}>
					<CreditnoteModal
						onClose={handleCreditNoteDialogClose}
						previousData={data}
					/>
				</PopupModal>
			)}
			<form onSubmit={formik.handleSubmit}>
				<h6 className="modal-h6">Cancel Tour</h6>
				<div>
					<div className="basic-form">
						<div>
							<h6 style={{ fontSize: "20px" }}>
								Are you sure you want to cancel the following guests?
							</h6>
						</div>
						<div className="row mb-2">
							<div className="col-md-6">
								<label className="form-label cancel-tour">
									{cancelMemberDetails?.fullName}
								</label>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12 mb-2">
								<label className="form-label">
									Reason for Cancellation<span className="error-star">*</span>
								</label>
								<input
									type="text"
									name="cancellationReason"
									className="form-control"
									value={formik.values.cancellationReason}
									{...formik.getFieldProps("cancellationReason")}
								/>
								<ErrorMessageComponent
									errors={formik.errors}
									fieldName={"cancellationReason"}
									touched={formik.touched}
								/>
							</div>
							<div className="col-md-4 mb-2">
								<label className="form-label">
									Cancellation Charges:<span className="error-star">*</span>
								</label>
								<input
									type="text"
									name="cancellationCharges"
									className="form-control"
									style={{ backgroundColor: "#f3f3f3" }}
									value={formik.values.cancellationCharges}
									disabled
								/>
							</div>
							<div className="col-md-4 mb-2">
								<label className="form-label">
									Refund Amount:<span className="error-star">*</span>
								</label>
								<input
									type="text"
									name="refundAmount"
									className="form-control"
									style={{ backgroundColor: "#f3f3f3" }}
									value={formik.values.refundAmount}
									disabled
								/>
							</div>
							<div className="col-md-12 mb-2">
								<label className="text-label">Upload Document</label>
								<div className="col-md-12">
									<div className="Neon Neon-theme-dragdropbox">
										<input
											className="file_upload"
											name={`document`}
											accept="image/*"
											id="filer_input2"
											type="file"
											draggable
											onChange={async (e) => {
												const selectedFile = e.target.files[0];
												const fileLink = await getFileLink(selectedFile);
												formik.setFieldValue(`document`, fileLink);
											}}
										/>
										<div className="Neon-input-dragDrop">
											{formik.values.document?.length == 0 ? (
												<div className="Neon-input-inner ">
													<div className="Neon-input-text">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 384 512"
															className="display-4"
														>
															<path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z" />
														</svg>
													</div>
													<a className="Neon-input-choose-btn blue">
														Drop files here or click to upload.
													</a>
												</div>
											) : (
												<img
													src={formik.values.document}
													alt="frontImage"
													width="100%"
													className="neon-img"
												/>
											)}
										</div>
									</div>
									<ErrorMessageComponent
										errors={formik.errors}
										fieldName={"document"}
										touched={formik.touched}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="d-flex justify-content-center mt-3 mb-2">
					{formik.values.refundAmount > 0 ? (
						<>
							<button
								disabled={isLoading}
								type="submit"
								className="btn  pdf-btn filter-btn btn-sm"
								style={{
									height: "32px",
									lineHeight: "1",
									margin: "0 10px 0 0",
								}}
								onClick={() => {
									formik.handleSubmit();
									if (Object.keys(formik.errors).length === 0) {
										setProcessRefund(true);
									}
								}}
							>
								Process Refund
							</button>
							<button
								disabled={isLoading}
								type="submit"
								className="btn btn-submit btn-primary btn-sm"
								onClick={() => {
									formik.handleSubmit();
									if (Object.keys(formik.errors).length === 0) {
										setCreditNote(true);
									}
								}}
							>
								Make Credit Note
							</button>
						</>
					) : (
						<button
							disabled={isSubmitting}
							type="submit"
							className="btn btn-submit btn-primary btn-sm"
							onClick={() => {
								formik.handleSubmit();
							}}
						>
							Cancel Tour
						</button>
					)}
				</div>
			</form>
		</>
	);
}

export default CancelEnquiryModal;
