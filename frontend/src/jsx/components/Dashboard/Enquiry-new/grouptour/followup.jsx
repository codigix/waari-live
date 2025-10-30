import React, { useEffect, useState } from "react";
import Select from "react-select";
import { get, post } from "../../../../../services/apiServices";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
import { toast } from "react-toastify";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import nocalls from "../../../../../assets/images/nocalls.png";
import { useDispatch, useSelector } from "react-redux";
import {
	updateFollowUpCallCount,
	updateGroupTourCompletionStatus,
} from "../../../../../store/actions/groupTourAction";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 2,
	borderRadius: "0.3rem",
};

const Followup = ({ enquiryId }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const [followUpHistory, setFollowUpHistory] = useState([]);

	const { permissions } = useSelector((state) => state.auth);

	const formik = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			callStatus: "",
			callSummary: "",
			nextFollowUpDate: "",
			nextFollowUpTime: "",
		},
		validationSchema: Yup.object({
			callStatus: Yup.string().required("Select Call Status"),
			callSummary: Yup.string()
			.required("Enter the Call Summary")
			.max(300, "Summary must be at most 300 characters long"),
			nextFollowUpDate: Yup.string().required("Enter Follow Up Date"),
			nextFollowUpTime: Yup.string().required("Enter Follow Up Time"),
		}),

		onSubmit: async (values, { resetForm }) => {
			let data = {
				enquiryGroupId: Number(enquiryId),
				callStatusId: values.callStatus,
				callSummary: values.callSummary,
				nextFollowUpDate: values.nextFollowUpDate,
				nextFollowUpTime: values.nextFollowUpTime,
			};

			try {
				setIsSubmitting(true);
				const response = await post(`/call-follow-up-gt`, data);

				setIsSubmitting(false);
				toast.success(response?.data?.message);

				getFollowUpHistory();

				dispatch(updateGroupTourCompletionStatus(2));
				resetForm();
			} catch (error) {
				setIsSubmitting(false);
				console.log(error);
			}
		},
	});

	const [openLost, setOpenLost] = React.useState(false);

	const handleOpenLost = (enquiryId) => {
		setOpenLost(true);
	};
	// to put the enquiry in lost start
	const handleCloseLost = () => setOpenLost(false);

	const validationLost = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			closureReason: "",
		},
		validationSchema: Yup.object({
			closureReason: Yup.string().required("Enter The closureReason"),
		}),

		onSubmit: async (values, { resetForm }) => {
			try {
				let data = {
					enquiryGroupId: enquiryId,
					closureReason: values.closureReason,
				};

				const response = await post(`/cancel-enquiry-group-tour`, data);
				resetForm();
				setOpenLost(false);
				toast.success(response?.data?.message);

				navigate("/lost-grouptour");
			} catch (error) {
				console.log(error);
			}
		},
	});

	const [callStatus, setCallStatus] = useState([]);

	const getCallStatusDropDown = async () => {
		try {
			const response = await get(`/dropdown-call-status`);

			const mappedData = response.data.data.map((item) => ({
				value: item.callStatusId,
				label: item.callStatusName,
			}));

			setCallStatus(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getCallStatusDropDown();
	}, []);

	const getFollowUpHistory = async () => {
		try {
			const response = await get(
				`/call-follow-history-gt?enquiryGroupId=${enquiryId}`
			);
			setFollowUpHistory(response.data?.data);
			dispatch(updateFollowUpCallCount(response.data?.data?.length));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getFollowUpHistory();
	}, []);

	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: "34px", // Adjust the height to your preference
		}),
	};

	useEffect(() => {
		const textarea = document.getElementById("resizableTextarea");

		const adjustTextareaHeight = () => {
			textarea.style.height = "auto"; // Reset height to auto to get the actual scroll height
			textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
		};

		textarea.addEventListener("input", adjustTextareaHeight);

		return () => {
			// Clean up the event listener when the component unmounts
			textarea.removeEventListener("input", adjustTextareaHeight);
		};
	}, []);

	return (
		<>
			<div className="card">
				<div className="card-body">
					<div className="basic-form">
						<form
							className="needs-validation"
							onSubmit={(e) => {
								e.preventDefault();
								formik.handleSubmit();
								return false;
							}}
						>
							<div
								className="card-header mb-2 p-0"
								style={{ paddingLeft: "0" }}
							>
								<div className="card-title h5">Call Follow-up</div>
							</div>
							<div className="row">
								<div className="col-md-6">
									<div className="row">
										<div className="mb-2 col-md-12">
											<label>Call status</label>
											<Select
												styles={customStyles}
												className="basic-single"
												classNamePrefix="select"
												name="callStatus"
												options={callStatus}
												value={
													callStatus.find(
														(option) =>
															option.value === formik.values.callStatus
													) || ""
												}
												onChange={(selectedOption) => {
													formik.setFieldValue(
														"callStatus",
														selectedOption ? selectedOption.value : ""
													);
												}}
												onBlur={formik.handleBlur}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"callStatus"}
												touched={formik.touched}
												key={"callStatus"}
											/>
										</div>

										<div className="mb-2 col-md-12">
											<label>Call summary</label>
											<textarea
												className="textarea"
												id="resizableTextarea"
												name="callSummary"
												rows="3"
												value={formik.values.callSummary}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
											></textarea>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"callSummary"}
												touched={formik.touched}
												key={"callSummary"}
											/>
											{/* <span style={{color:"#ff0000",fontSize:"12px"}}>Note:Max char 300</span> */}
										</div>

										<div className="mb-2 col-md-5">
											<label>Next Follow-up Date</label>

											<input
												type="date"
												className="form-control"
												placeholder=""
												name="nextFollowUpDate"
												min={new Date().toISOString().split("T")[0]}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.nextFollowUpDate}
											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"nextFollowUpDate"}
												touched={formik.touched}
												key={"nextFollowUpDate"}
											/>
										</div>

										<div className="mb-2 col-md-5">
											<label>Follow-up Time</label>

											<input
												type="time"
												className="form-control"
												name={`nextFollowUpTime`}
												value={formik.values.nextFollowUpTime}
												onChange={formik.handleChange}
												min={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

											/>
											<ErrorMessageComponent
												errors={formik.errors}
												fieldName={"nextFollowUpTime"}
												touched={formik.touched}
												key={"nextFollowUpTime"}
											/>
										</div>
									</div>
									<div className="row mt-4">
										<div className="col-md-6 col-lg-4 col-sm-6 col-12 mx-auto mb-2 justify-content-center d-flex">
											<button
												className="btn btn-submit btn-primary"
												disabled={isSubmitting}
												type="submit"
											>
												{isSubmitting ? "Saving..." : "Save Follow up"}
											</button>
										</div>
										<div className="col-md-6 col-lg-4 col-sm-6 col-12  mx-auto mb-2 justify-content-center d-flex">
											<button
												type="button"
												className="btn btn-primary filter-btn mt-0"
												onClick={() =>
													navigate(`/enquiry/${enquiryId}?activeTab=journey`)
												}
											>
												Proceed for quotation
											</button>
										</div>
										{hasComponentPermission(permissions, 29) && (
											<div className="col-md-6 col-lg-4 col-sm-6 col-12  mx-auto mb-2 justify-content-center d-flex ">
												<button
													className="btn btn-danger "
													type="button"
													onClick={() => handleOpenLost(enquiryId)}
												>
													Close Lead
												</button>
											</div>
										)}
									</div>
								</div>
								<div className="col-md-6">
									<div
										className="card-header mb-2 p-0 "
										style={{ paddingLeft: "0" }}
									>
										<div className="card-title h6 text-center">
											Follow-up history
										</div>
									</div>

									{followUpHistory.length > 0 ? (
										followUpHistory.map((followup, index) => (
											<div
												className="followup1"
												key={followup.nextFollowUpTime + index}
											>
												<div
													className="card-header mb-2 p-0"
													style={{ paddingLeft: "0" }}
												>
													<div className="card-title h6">
														Call no: {index + 1}
													</div>
												</div>
												<p className="mb-0">
													<b>
														Date and time of follow up : -
														{followup.currentFollowUpDate +
															"  " +
															followup.currentFollowUpTime}
													</b>
												</p>
												<div className="d-flex">
													<label>Call Status :</label>
													<h6 className="mb-0 call-followup  ">
														{followup.callStatusName}
													</h6>
												</div>
												<div className="d-flex">
													<label>Call Summary :</label>

													<h6 className="mb-0 call-followup">
														{followup.callSummary}
													</h6>
												</div>
												<div className="d-flex">
													<label>Next followup :</label>
													<h6 className="mb-0 call-followup followup-bg">
														{followup.nextFollowUpDate +
															"  " +
															followup.nextFollowUpTime}
													</h6>
												</div>
											</div>
										))
									) : (
										<div
											className="followup1 d-flex justify-content-center text-center m-auto p-3"
											style={{ flexDirection: "column" }}
										>
											<img src={nocalls} width={30} className="m-auto" />
											<div className="h-6 border mt-2">No Data Found</div>
										</div>
									)}
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			<Modal
				open={openLost}
				onClose={handleCloseLost}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography>
						<div
							onClick={handleCloseLost}
							className="close d-flex justify-content-end text-danger"
						>
							<span>&times;</span>
						</div>
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						<form
							className="needs-validation"
							onSubmit={(e) => {
								e.preventDefault();
								validationLost.handleSubmit();
								return false;
							}}
						>
							<div className="form-group mb-2">
								<h5
									style={{
										textAlign: "center",
										marginBottom: "20px",
										fontWeight: "700",
									}}
								>
									{" "}
									Reason For Closure
								</h5>
								<textarea
									type="text"
									id="reasonclosure"
									name="closureReason"
									className="textarea"
									onChange={validationLost.handleChange}
									onBlur={validationLost.handleBlur}
									value={validationLost.values.closureReason}
								/>
								{validationLost.touched.closureReason &&
								validationLost.errors.closureReason ? (
									<span className="error">
										{validationLost.errors.closureReason}
									</span>
								) : null}
							</div>
							<div className="mb-2 mt-2 row">
								<div className="col-lg-12 d-flex justify-content-end">
									<button type="submit" className="btn btn-submit btn-primary">
										Submit
									</button>
								</div>
							</div>
						</form>
					</Typography>
				</Box>
			</Modal>
		</>
	);
};
export default Followup;
