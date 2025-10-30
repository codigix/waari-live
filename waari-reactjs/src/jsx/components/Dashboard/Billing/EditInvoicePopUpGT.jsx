import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { get, post } from "../../../../services/apiServices";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";

function EditInvoicePopUp({ invoice, onClose, familyHeadGtId }) {
    
	const [isLoading, setIsLoading] = useState(false);

	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			billingName: invoice?.billingName || "",
			phoneNo: invoice?.phoneNo || "",
			address: invoice?.address || "",
			gstin: invoice?.gstin || "",
            panNo: invoice?.panNo || "",
            
		},
		validationSchema: Yup.object({
			billingName: Yup.string().required("Enter Billing Name"),
			phoneNo: Yup.string()
				.min(10, "Please enter correct contact number")
				.max(10, "Please enter correct contact number"),
			address: Yup.string().required("Please enter Address"),
			gstin: Yup.string()
			.matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[0-9A-Z]{1}$/, {
				message:
					"Invalid GST format (27ABCDE1234F1Z5)",
					

				excludeTest: (val) => !val, // Only show error if there's a value
			}).nullable(),
			panNo: Yup.string()
			.matches(
				/^[A-Z]{5}[0-9]{4}[A-Z]$/,
				"Invalid PAN number format. Please enter in the format ABCDE1234F"
			).nullable()
		}),

		onSubmit: async (values) => {
			let data = {
				familyHeadGtId,
				billingName: values.billingName,
				phoneNo: values.phoneNo,
				address: values.address,
				gstin: values.gstin,
				panNo: values.panNo,
			};

            try {
                
				setIsLoading(true);
				const response = await post(`/update-billing-details-gt`, data);
				setIsLoading(false);
				toast.success(response?.data?.message);

				// close popup edit form on success
				onClose();
			} catch (error) {
				setIsLoading(false);
				console.log(error);
			}
		},
	});
	
	useEffect(() => {
		const textarea = document.getElementById("address");

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
		<div>
			<h6 className="modal-h6" style={{textAlign: "center"}}>Edit Invoice - {invoice?.invoiceNo}</h6>
			<div>
			
						<div className="basic-form">
							<form
								className="needs-validation"
								onSubmit={(e) => {
									e.preventDefault();
									validation.handleSubmit();
									return false;
								}}
							>
								<div className="card-header" style={{ paddingLeft: "0" }}>
									<div className="card-title h5">Personal Details</div>
								</div>
                                <div className="row">
                                    
									<div className="mb-2 col-md-6 col-lg-6 col-sm-6 col-12">
										<label className="form-label">
											Billing Name<span className="error-star">*</span>
										</label>
										<input
											type="text"
											className="form-control"
											name="billingName"
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.billingName}
										/>
										<ErrorMessageComponent
											errors={validation.errors}
											fieldName={"billingName"}
											touched={validation.touched}
											key={"billingName"}
										/>
									</div>

									<div className="mb-2 col-md-6 col-lg-6 col-sm-6 col-12">
										<label className="form-label">
											Contact No.
										</label>
										<div className="d-flex">
											<input
												type="tel"
												className="form-control"
												placeholder=""
												name="phoneNo"
												minLength={10}
												maxLength={10}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												value={validation.values.phoneNo}
											/>
										</div>
										<ErrorMessageComponent
											errors={validation.errors}
											fieldName={"phoneNo"}
											touched={validation.touched}
											key={"phoneNo"}
										/>
                                    </div>
                                    
                                    <div className="mb-2 col-md-6 col-lg-6 col-sm-6 col-12">
										<label className="form-label">
											GST Number
										</label>
										<input
											type="text"
											className="form-control"
											name="gstin"
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.gstin}
										/>
										<ErrorMessageComponent
											errors={validation.errors}
											fieldName={"gstin"}
											touched={validation.touched}
											key={"gstin"}
										/>
									</div>

                                    
                                    <div className="mb-2 col-md-6 col-lg-6 col-sm-6 col-12">
										<label className="form-label">
											Pan Card Number
										</label>
										<input
											type="text"
											className="form-control"
											name="panNo"
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.panNo}
										/>
										<ErrorMessageComponent
											errors={validation.errors}
											fieldName={"panNo"}
											touched={validation.touched}
											key={"panNo"}
										/>
									</div>


									<div className="col-md-12 col-lg-12 col-sm-12 col-12 mb-2">
										<label>
											Address
											<span className="error-star">*</span>
										</label>
										<textarea
											type="text"
											className="textarea"
											id="address"
											name="address"
                                            onChange={validation.handleChange}
											onBlur={validation.handleBlur}
                                            
											value={validation.values.address}
										/>
										<ErrorMessageComponent
											errors={validation.errors}
											fieldName={"address"}
											touched={validation.touched}
										/>
									</div>
								</div>
								<div className="mb-2 mt-2 row">
									<div className="col-lg-12 d-flex justify-content-between">
										<button
											onClick={() => onClose()}
											type="button"
											className="btn btn-back"
										>
											Close
										</button>
										<button
											type="submit"
											className="btn btn-submit btn-primary"
											disabled={isLoading}
										>
											{isLoading ? "Submitting" : "Submit"}
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			
	);
}

export default EditInvoicePopUp;
