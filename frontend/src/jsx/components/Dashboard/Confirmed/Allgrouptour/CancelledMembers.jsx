import React, { useState } from "react";
import PopupModal from "../../Popups/PopupModal";
import RefundProofPopUp from "./RefundProofModal";
import Select from "react-select";
import { post } from "../../../../../services/apiServices";
import { toast } from "react-toastify";
import ViewCreditnoteModal from "./ViewCreditNoteModal";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import { useSelector } from "react-redux";

const status = [
	{ value: "0", label: "Initiated" },
	{ value: "1", label: "Completed" },
];

const customStyles = {
	control: (provided, state) => ({
		...provided,
		height: "34px", // Adjust the height to your preference
	}),
};

const CancelledMembers = ({
	enquiryId,
	cancelledMember,
	familyHeadGtId,
	reRenderCancelledMembersOnProofUpload,
}) => {
	const [refundProof, setRefundProof] = useState(false);
	const [showCreditNote, setShowCreditNote] = useState(false);
	const [creditNote, setCreditNote] = useState("");

	const { permissions } = useSelector((state) => state.auth);

	const handleDialogClose = () => {
		setRefundProof(false);
		reRenderCancelledMembersOnProofUpload();
	};

	const handleViewCreditDialogClose = () => {
		setShowCreditNote(false);
	};

	const viewCreditNote = (creditNote) => {
		setShowCreditNote(true);
		setCreditNote(creditNote);
	};

	const data = {
		enquiryGroupId: enquiryId,
		familyHeadGtId: familyHeadGtId,
		groupGuestDetailId: cancelledMember.groupGuestDetailId,
	};

	const handleStatusChange = async (event) => {
		if (Number(event.value) === 1) {
			try {
				const finalData = {
					...data,
				};
				const result = await post("cancel-status-update-gt", finalData);
				toast.success(result?.data?.message);
				reRenderCancelledMembersOnProofUpload();
			} catch (error) {
				console.log(error);
			}
		}
	};
	return (
		<form>
			{refundProof && (
				<PopupModal open={true} onDialogClose={handleDialogClose}>
					<RefundProofPopUp previousData={data} onClose={handleDialogClose} />
				</PopupModal>
			)}
			{showCreditNote && (
				<PopupModal open={true} onDialogClose={handleViewCreditDialogClose}>
					<ViewCreditnoteModal
						onClose={handleViewCreditDialogClose}
						creditNote={creditNote}
					/>
				</PopupModal>
			)}
			<div className="row">
				<div className="col-md-6">
					<div className="card-header card-header-second mb-2 mt-2 p-0">
						<div className="card-title h5">Cancellation Details</div>
					</div>
					<div className="mb-2">
						<label className="form-label">Name of guest</label>
						<input
							disabled
							value={cancelledMember.name}
							className="form-control"
						/>
					</div>
					<div className="mb-2">
						<label className="form-label">Reason for Cancellation:</label>
						<input
							disabled
							value={cancelledMember.cancellationReason}
							className="form-control"
						/>
					</div>
					<div className="mb-2">
						<label className="form-label">Cancellation Charges</label>
						<input
							disabled
							value={cancelledMember.cancellationCharges}
							className="form-control"
						/>
					</div>
					<div className="mb-2">
						<label className="form-label">Refund Amount</label>
						<input
							disabled
							value={cancelledMember.refundAmount}
							className="form-control"
						/>
					</div>
					{Number(cancelledMember.refundAmount) !== 0 && (
						<div className="mb-2">
							<label className="form-label">Opted for:</label>
							<input
								disabled
								value={
									Number(cancelledMember.cancelType) === 1
										? "Process Refund"
										: "Credit Note"
								}
								className="form-control"
							/>
						</div>
					)}
					{Number(cancelledMember.cancelType) === 1 && (
						<div className="mb-2">
							<label className="form-label">Status</label>
							{/* <input
								disabled
								value={
									Number(cancelledMember.status) === 0
										? "Initiated"
										: "Completed"
								}
								className="form-control"
							/> */}
							<Select
								isDisabled={
									Number(cancelledMember.status) === 1 ||
									!hasComponentPermission(permissions, 220)
								}
								styles={customStyles}
								className="basic-single"
								classNamePrefix="select"
								options={status}
								value={status.find(
									(item) =>
										Number(item.value) === Number(cancelledMember.status)
								)}
								onChange={(event) => handleStatusChange(event)}
							/>
						</div>
					)}
				</div>
				{Number(cancelledMember.cancelType) === 1 ? (
					<div className="col-md-6">
						<div className="card-header card-header-second mb-2 mt-2 p-0">
							<div className="card-title h5">Details of Refund</div>
						</div>
						<div className="mb-2">
							<label className="form-label">Account Name</label>
							<input
								disabled
								value={cancelledMember.accountName}
								className="form-control"
							/>
						</div>
						<div className="mb-2">
							<label className="form-label">Account Number</label>
							<input
								disabled
								value={cancelledMember.accountNo}
								className="form-control"
							/>
						</div>
						<div className="mb-2">
							<label className="form-label">Bank</label>
							<input
								disabled
								value={cancelledMember.bank}
								className="form-control"
							/>
						</div>
						<div className="mb-2">
							<label className="form-label">Branch</label>
							<input
								disabled
								value={cancelledMember.branch}
								className="form-control"
							/>
						</div>
						<div className="mb-2">
							<label className="form-label">IFSC Code</label>
							<input
								disabled
								value={cancelledMember.ifsc}
								className="form-control"
							/>
						</div>
					</div>
				) : (
					""
				)}
			</div>
			<div className="mb-2 mt-4 row d-flex justify-content-center">
				<div className="col-lg-8">
					<div className="row">
						{Number(cancelledMember.cancelType) === 1 ? (
							<>
								{hasComponentPermission(permissions, 222) && (
									<div className="col-md-6 col-lg-4 col-sm-6 col-12 mx-auto mb-2 justify-content-center d-flex">
										<button
											type="button"
											onClick={() => setRefundProof(true)}
											className="btn btn-submit btn-primary"
										>
											Upload Refund Proof
										</button>
									</div>
								)}
								{cancelledMember.refundProof &&
									hasComponentPermission(permissions, 223) && (
										<div className="col-md-6 col-lg-4 col-sm-6 col-12  mx-auto mb-2 justify-content-center d-flex">
											<a
												href={cancelledMember.refundProof}
												target="_blank"
												className="btn add-btn btn-secondary"
											>
												View Refund Proof
											</a>
										</div>
									)}
							</>
						) : (
							""
						)}
						{Number(cancelledMember.cancelType) === 2 &&
						cancelledMember.creditNote ? (
							<div className="col-md-6 col-lg-3 col-sm-6 col-12  mx-auto mb-2 justify-content-center d-flex ">
								<button
									type="button"
									onClick={() => viewCreditNote(cancelledMember.creditNote)}
									className="btn btn-back"
								>
									View Credit Note
								</button>
							</div>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		</form>
	);
};

export default CancelledMembers;
