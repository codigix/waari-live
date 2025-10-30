import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
import { post } from "../../../../../services/apiServices";
import { toast } from "react-toastify";
import { useFormik } from "formik";

const initialValues = {
	creditNote: "",
};

const validationSchema = Yup.object().shape({
	creditNote: Yup.string().min(4, "Please enter a valid credit note (more than 4 characters)")
		.required("Credit Note is required")
});

function CreditnoteModal({ onClose, previousData }) {
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
					creditNote: values.creditNote
				};
				const result = await post("credit-note-gt", data);

				toast.success(result?.data?.message);


				onClose(false);

				setIsSubmitting(false);
			} catch (error) {
				setIsSubmitting(false);
				console.log(error);
			}
		},
	});


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
			<form onSubmit={formik.handleSubmit}>
				<h6 className="modal-h6">Credit Note</h6>
				<div>
					<div className="basic-form">
						<div className="row">
							<div className="col-md-12 mb-2">
								<label className="form-label">
									Make Credit Note:<span className="error-star">*</span>
								</label>
								<textarea
									className="textarea"
									id="resizableTextarea"
									name="creditNote"
									rows="3"
									value={formik.values.creditNote}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								></textarea>
								<ErrorMessageComponent
									errors={formik.errors}
									fieldName={"creditNote"}
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
					<button type="submit" className="btn btn-submit btn-primary" disabled={isSubmitting}>
						Submit
					</button>
				</div>
			</form>
		</>
	);
}

export default CreditnoteModal;
