import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
import { post } from "../../../../../services/apiServices";
import { toast } from "react-toastify";

const initialValues = {
	accountName: "",
	accountNo: "",
	bank: "",
	branch: "",
	ifsc: "",
};

const validationSchema = Yup.object().shape({
	accountName: Yup.string()
		.required("Account name is required")
		.matches(/^[a-zA-Z\s]+$/, "Invalid Account name"),
	accountNo: Yup.string()
		.required("Account number is required")
		.matches(/^\d{9,18}$/, "Account number must be 9 to 18 digits"),
	bank: Yup.string()
		.required("Bank name is required")
		.matches(/^[a-zA-Z\s]+$/, "Invalid bank name"),
	branch: Yup.string()
		.required("Branch is required")
		.matches(/^[a-zA-Z\s]+$/, "Invalid branch name"),
	ifsc: Yup.string()
		.required("IFSC code is required")
		.matches(/^[A-Za-z]{4}\d{7}$/, "Invalid IFSC code. Format: ABCD0123456"),
});

function ProcessrefundModal({ onClose, previousData }) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			// 1.get All Values and submit that to api and 2.then Close the Both PopUps and 3.then Refresh Family Members List Data
			try {
				setIsSubmitting(true);
				const data = {
					...previousData,
					accountName: values.accountName,
					accountNo: values.accountNo,
					bank: values.bank,
					branch: values.branch,
					ifsc: values.ifsc,
				};
                const result = await post("process-refund-ct", data);
                
                toast.success(result?.data?.message);
                
                onClose(false);

				setIsSubmitting(false);
			} catch (error) {
				setIsSubmitting(false);
				console.log(error);
			}
		},
    });
    

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<h6 className="modal-h6">Process Refund</h6>
				<div>
					<div className="basic-form">
						<div className="row">
							<div className="col-md-4 mb-2">
								<label className="form-label">
									Account Name<span className="error-star">*</span>
								</label>
								<input type="text" name="accountName" className="form-control"
                                	value={formik.values.accountName}
									{...formik.getFieldProps("accountName")}
                                />
                                <ErrorMessageComponent
									errors={formik.errors}
									fieldName={"accountName"}
									touched={formik.touched}
								/>
							</div>
							<div className="col-md-4 mb-2">
								<label className="form-label">
									Account Number:<span className="error-star">*</span>
								</label>
								<input type="text" name="accountNo" className="form-control"
                                	value={formik.values.accountNo}
									{...formik.getFieldProps("accountNo")}
                                />
                                  <ErrorMessageComponent
									errors={formik.errors}
									fieldName={"accountNo"}
									touched={formik.touched}
								/>
							</div>
							<div className="col-md-4 mb-2">
								<label className="form-label">
									Bank:<span className="error-star">*</span>
								</label>
								<input type="text" name="bank" className="form-control"
                                	value={formik.values.bank}
									{...formik.getFieldProps("bank")}
                                />
                                     <ErrorMessageComponent
									errors={formik.errors}
									fieldName={"bank"}
									touched={formik.touched}
								/>
							</div>
							<div className="col-md-4 mb-2">
								<label className="form-label">
									Branch:<span className="error-star">*</span>
								</label>
								<input type="text" name="branch" className="form-control"
                                	value={formik.values.branch}
									{...formik.getFieldProps("branch")}
                                />
                                  <ErrorMessageComponent
									errors={formik.errors}
									fieldName={"branch"}
									touched={formik.touched}
								/>
							</div>
							<div className="col-md-4 mb-2">
								<label className="form-label">
									IFSC Code:<span className="error-star">*</span>
								</label>
								<input type="text" name="ifsc" className="form-control"
                                	value={formik.values.ifsc}
									{...formik.getFieldProps("ifsc")}
                                />
                                   <ErrorMessageComponent
									errors={formik.errors}
									fieldName={"ifsc"}
									touched={formik.touched}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="d-flex justify-content-center mt-3 mb-2">
					<button
						className="btn  pdf-btn filter-btn btn-sm "
						style={{ height: "32px", lineHeight: "1", margin: "0 10px 0 0" }}
						onClick={() => onClose(false)}
					>
						Close
					</button>
					<button
						type="submit"
						className="btn btn-submit btn-primary"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting" : "Submit"}
					</button>
				</div>
			</form>
		</>
	);
}

export default ProcessrefundModal;
