import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get, post } from "../../../../../services/apiServices";
import nocalls from "../../../../../assets/images/nocalls.png"
import { useDispatch } from "react-redux";
import { updateFollowUpCallCount } from "../../../../../store/actions/groupTourAction";


const FollowupCT = ({ enquiryId }) => {
    const [isLoading, setIsLoading] = useState(false);
	const [followUpHistory, setFollowUpHistory] = useState([]);
	const dispatch = useDispatch();

    
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
			callSummary: Yup.string().required("Enter call summary"),
			nextFollowUpDate: Yup.string().required("Enter Follow Up Date"),
			nextFollowUpTime: Yup.string().required("Enter Follow Up Time"),
		}),

		onSubmit: async (values) => {
			let data = {
				enquiryCustomId: Number(enquiryId),
				callStatusId: values.callStatus,
				callSummary: values.callSummary,
				nextFollowUpDate: values.nextFollowUpDate,
				nextFollowUpTime: values.nextFollowUpTime,
			};

            try {
				setIsLoading(true);
				const response = await post(`/call-follow-up-ct`, data);
				setIsLoading(false);
                toast.success(response?.data?.message);

                formik.resetForm()
                formik.setFieldValue(
                    "callStatus",
                   ""
                );

                getFollowUpHistory()

                
			} catch (error) {
				setIsLoading(false);
				console.log(error);
			}
		},
    });
    

	const getFollowUpHistory = async () => {
		try {
			const response = await get(
				`/call-follow-history-ct?enquiryCustomId=${enquiryId}`
			);
			setFollowUpHistory(response.data?.data);
			dispatch(updateFollowUpCallCount(response.data?.data?.length))
			
			} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getFollowUpHistory();
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
							{/* <div className="card-header mb-2 p-0" style={{ paddingLeft: "0" }}>
								<div className="card-title h5">Call Follow-up</div>
							</div> */}
							<div className="row">
								{/* <div className="col-md-6">
									<div className="row">
										<div className="mb-2 col-md-12">
											<label>Call status</label>
											<Select
												styles={customStyles}
												className="basic-single"
												classNamePrefix="select"
												name="callStatus"
												options={callStatus}
												onChange={(selectedOption) => {
													formik.setFieldValue(
														"callStatus",
														selectedOption ? selectedOption.value : ""
													);
												}}
												onBlur={formik.handleBlur}
												value={callStatus.find(
													(option) => option.value === formik.values.callStatus
												)}
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
												disabled={isLoading}
												type="submit"
											>
												{isLoading ? "Submitting" : "Submit Follow up"}
											</button>
										</div>
										<div className="col-md-6 col-lg-4 col-sm-6 col-12  mx-auto mb-2 justify-content-center d-flex">
                                            <button
												type="button"
												className="btn btn-primary filter-btn mt-0"
												onClick={() => navigate(`/enquiry-ct/${enquiryId}?activeTab=journey`)}
											>
												Proceed for quotation
											</button>
										</div>
										<div className="col-md-6 col-lg-4 col-sm-6 col-12  mx-auto mb-2 justify-content-center d-flex ">
                                            <button
                                                className="btn btn-danger "
                                                type="button"
                                                onClick={() => handleOpenLost(enquiryId)}
                                            >
												Close Lead
											</button>
										</div>
									</div>
								</div> */}
								<div className="col-md-6">
									<div
										className="card-header mb-2 p-0 "
										style={{ paddingLeft: "0" }}
									>
										<div className="card-title h6 text-center">
											Follow-up history
										</div>
									</div>

									{followUpHistory.length > 0 ? followUpHistory.map((followup, index) => (
										<div className="followup1" key={followup.nextFollowUpTime + index}>
											<div
												className="card-header mb-2 p-0"
												style={{ paddingLeft: "0" }}
											>
												<div className="card-title h6">Call no: {index + 1}</div>
											</div>
											<p className="mb-0">
												<b>Date and time of follow up : -
														{followup.currentFollowUpDate +
															"  " +
															followup.currentFollowUpTime}</b>
											</p>
											<div className="d-flex">
												<label>Call Status :</label>
												<h6 className="mb-0 call-followup">{followup.callStatusName}</h6>
											</div>
											<div className="d-flex">
												<label>Call Summary :</label>

                                                
												<h6 className="mb-0 call-followup">{followup.callSummary}</h6>
											</div>
											<div className="d-flex">
												<label>Next followup :</label>
                                                <h6 className="mb-0 call-followup followup-bg">{followup.nextFollowUpDate + "  " + followup.nextFollowUpTime}</h6>
											</div>
										</div>
									)) : 	
									<div className="followup1 d-flex justify-content-center text-center m-auto p-3" style={{flexDirection:"column"}} >
										<img src={nocalls}  width={30} className="m-auto"/>
									<div className="h-6 border mt-2">No Data Found</div>
									</div>
									}
								</div>
							</div>
						</form>
					</div>
				</div>
            </div>
            
		</>
	);
};
export default FollowupCT;
